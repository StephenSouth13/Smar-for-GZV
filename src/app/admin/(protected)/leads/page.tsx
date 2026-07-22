import { Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LeadCard } from "@/components/admin/LeadCard";
import { listLeadsAction } from "@/lib/actions/leads";

export default async function AdminLeadsPage() {
  const leads = await listLeadsAction();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink">Tin nhắn liên hệ</h1>
        <p className="text-ink-muted mt-1">Yêu cầu tư vấn khách hàng gửi từ form liên hệ trên website.</p>
      </div>

      {leads.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center text-ink-muted">
            <Mail className="mx-auto h-8 w-8 mb-2 opacity-50" />
            Chưa có tin nhắn nào.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {leads.map((lead) => (
            <LeadCard key={lead.id} lead={lead} />
          ))}
        </div>
      )}
    </div>
  );
}
