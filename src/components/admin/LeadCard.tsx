"use client";

import { useEffect, useState, useTransition } from "react";
import { Mail, Phone, Building2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmDeleteButton } from "@/components/admin/ConfirmDeleteButton";
import { markLeadReadAction, deleteLeadAction, type LeadDoc } from "@/lib/actions/leads";

function formatDate(iso: string) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export function LeadCard({ lead }: { lead: LeadDoc }) {
  const [read, setRead] = useState(lead.read);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!lead.read) {
      startTransition(async () => {
        await markLeadReadAction(lead.id);
        setRead(true);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const customEntries = Object.entries(lead.customData).filter(([, v]) => v);

  return (
    <Card className={read ? "border-line/70" : "border-brand/50 bg-brand/3 shadow-sm"}>
      <CardContent className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-ink">{lead.name}</h3>
              {!read && <Badge className="bg-brand">Mới</Badge>}
            </div>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-muted">
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" />
                <a href={`tel:${lead.phone}`} className="hover:text-brand-dark">
                  {lead.phone}
                </a>
              </span>
              {lead.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5" />
                  <a href={`mailto:${lead.email}`} className="hover:text-brand-dark">
                    {lead.email}
                  </a>
                </span>
              )}
              {lead.company && (
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" />
                  {lead.company}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                {formatDate(lead.createdAt)}
              </span>
            </div>
          </div>
          <ConfirmDeleteButton itemLabel={lead.name} onDelete={() => deleteLeadAction(lead.id)} />
        </div>

        {lead.projectTypes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {lead.projectTypes.map((type) => (
              <Badge key={type} variant="secondary">
                {type}
              </Badge>
            ))}
          </div>
        )}

        {lead.message && <p className="mt-3 text-sm text-ink leading-relaxed whitespace-pre-line">{lead.message}</p>}

        {customEntries.length > 0 && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 rounded-lg bg-surface p-3 text-sm">
            {customEntries.map(([key, value]) => (
              <div key={key}>
                <span className="text-ink-muted">{key}: </span>
                <span className="text-ink font-medium">{value}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
