const fs = require("fs");

if (process.platform === "win32") {
  const originalSymlink = fs.symlink;
  const originalSymlinkSync = fs.symlinkSync;
  const originalPromiseSymlink = fs.promises.symlink;

  function shouldFallback(error, target) {
    if (!error || error.code !== "EPERM") return false;
    try {
      return fs.statSync(target).isDirectory();
    } catch {
      return false;
    }
  }

  fs.symlink = function patchedSymlink(target, path, type, callback) {
    if (typeof type === "function") {
      callback = type;
      type = undefined;
    }

    return originalSymlink.call(this, target, path, type, (error) => {
      if (!shouldFallback(error, target)) {
        callback(error);
        return;
      }

      originalSymlink.call(this, target, path, "junction", callback);
    });
  };

  fs.symlinkSync = function patchedSymlinkSync(target, path, type) {
    try {
      return originalSymlinkSync.call(this, target, path, type);
    } catch (error) {
      if (!shouldFallback(error, target)) throw error;
      return originalSymlinkSync.call(this, target, path, "junction");
    }
  };

  fs.promises.symlink = async function patchedPromiseSymlink(target, path, type) {
    try {
      return await originalPromiseSymlink.call(this, target, path, type);
    } catch (error) {
      if (!shouldFallback(error, target)) throw error;
      return originalPromiseSymlink.call(this, target, path, "junction");
    }
  };
}
