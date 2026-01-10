/**
 * DocumentsTab Component
 * Manage manuals, warranties, and other documents for a system
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, Download, Trash2, Upload, ExternalLink } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface Document {
  id: string;
  name: string;
  type: 'manual' | 'warranty' | 'receipt' | 'spec-sheet' | 'other';
  url: string;
  uploadedAt: string;
  size: number;
  mimeType: string;
}

interface DocumentsTabProps {
  systemId: string;
}

export function DocumentsTab({ systemId }: DocumentsTabProps) {
  const queryClient = useQueryClient();

  const { data: documents, isLoading } = useQuery<Document[]>({
    queryKey: ['system-documents', systemId],
    queryFn: async () => {
      const response = await api.get(`/systems/${systemId}/documents`);
      return response.data.documents || [];
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      await api.delete(`/systems/${systemId}/documents/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-documents', systemId] });
      toast.success('Document deleted');
    },
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getTypeLabel = (type: Document['type']) => {
    const labels = {
      'manual': 'Manual',
      'warranty': 'Warranty',
      'receipt': 'Receipt',
      'spec-sheet': 'Spec Sheet',
      'other': 'Other'
    };
    return labels[type] || 'Document';
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-20" />
        ))}
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Documents</h3>
        <p className="text-gray-600 mb-6">
          Upload manuals, warranties, and other important documents
        </p>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Documents ({documents.length})</h3>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>

      <div className="space-y-3">
        {documents.map(doc => (
          <Card key={doc.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{doc.name}</h4>
                    <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                        {getTypeLabel(doc.type)}
                      </span>
                      <span>{formatFileSize(doc.size)}</span>
                      <span>{format(parseISO(doc.uploadedAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(doc.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(doc.url)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (window.confirm('Delete this document?')) {
                        deleteDocumentMutation.mutate(doc.id);
                      }
                    }}
                    className="text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
