import { Badge } from "@workspace/ui/components/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { CheckCircle2, Clock, FileText } from "lucide-react";
import { useState } from "react";

export default function RequiredDocuments() {
    const [pendingDocuments] = useState([
        { id: 1, name: 'TIN Number', status: 'missing' },
        { id: 2, name: 'Primary ID (UMID, SSS, Postal ID, National ID, Passport)', status: 'submitted' },
        { id: 3, name: 'Proof of Income', status: 'missing' }
    ]);

    const totalDocs = pendingDocuments.length;
    const submittedDocs = pendingDocuments.filter(doc => doc.status === 'submitted').length;
    const completionPercentage = Math.round((submittedDocs / totalDocs) * 100);

    const pendingCount = pendingDocuments.filter(doc =>
        doc.status === 'missing' || doc.status === 'rejected'
    ).length;

      const getStatusClass = (status: string) => {
        switch (status) {
        case 'missing':
            return 'bg-gray-100 text-gray-600';
        case 'submitted':
            return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        case 'rejected':
            return 'bg-rose-50 text-rose-700 border-rose-200';
        default:
            return 'bg-gray-100';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
        case 'missing':
            return <Clock className="h-5 w-5 text-gray-400" />;
        case 'submitted':
            return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
        case 'rejected':
            return <Clock className="h-5 w-5 text-rose-500" />;
        default:
            return null;
        }
    };

    return (
        <>
        <Card className="border shadow-sm w-full mt-4 bg-white">
                  <CardHeader className="bg-gray-50 border-b border-gray-200 p-4 sm:p-6">
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2 min-w-0">
                          <FileText className="h-5 w-5 text-gray-600 flex-shrink-0" />
                          <span className="truncate max-w-full">Required Documents</span>
                        </CardTitle>
                        <Badge className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs px-3 py-1 rounded-full border border-gray-300 font-medium self-start sm:self-center">
                          {pendingCount} Pending
                        </Badge>
                      </div>

                      {/* Progress Section */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 font-medium truncate">Progress</span>
                          <span className="font-semibold text-gray-900">{completionPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div 
                            className="bg-gray-700 h-2 rounded-full transition-all duration-300 ease-out" 
                            style={{ width: `${completionPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-100">
                      {pendingDocuments.map((doc, index) => (
                        <div
                          key={doc.id}
                          className={`flex flex-col sm:flex-row sm:justify-between items-start sm:items-center p-4 gap-3 hover:bg-slate-50/70 transition-all duration-200 ${
                            doc.status === 'submitted' ? 'bg-emerald-50/30' : ''
                          } ${index === 0 ? '' : 'border-t border-gray-50'}`}
                        >
                          <div className="flex items-start gap-3 min-w-0 w-full">
                            <div
                              className={`p-2 rounded-lg flex-shrink-0 ${
                                doc.status === 'submitted'
                                  ? 'bg-emerald-100'
                                  : doc.status === 'rejected'
                                  ? 'bg-rose-100'
                                  : 'bg-amber-100'
                              }`}
                            >
                              {getStatusIcon(doc.status)}
                            </div>

                            <div className="space-y-1 min-w-0">
                              <div className="text-xs font-semibold text-slate-800 truncate max-w-[240px] sm:max-w-xs">
                                {doc.name}
                              </div>
                              <Badge
                                variant="outline"
                                className={`text-xs font-medium px-2 py-0.5 ${getStatusClass(doc.status)}`}
                              >
                                {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                              </Badge>
                            </div>
                          </div>

                          {/* Upload / Chevron */}
                          {/* <div className="w-full sm:w-auto">
                            {(doc.status === 'missing' || doc.status === 'rejected') ? (
                              <Popover>
                                <PopoverTrigger className="group relative backdrop-blur-sm bg-white/10 border border-white/20 hover:bg-white/20 text-gray-800 px-2 py-1.5 rounded-md font-medium transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-1.5 text-xs">
                                  <Upload className="h-3 w-3 group-hover:scale-110 transition-transform" />
                                  Upload
                                </PopoverTrigger>
                                <PopoverContent className="w-full max-w-xs p-4 shadow-xl border-0">
                                  <div className="space-y-4">
                                    <p className="text-sm text-slate-600">Upload your {doc.name.toLowerCase()}</p>
                                    <FileUploadDropzone onDrop={handleDrop} />
                                    {useUploadedFilesStore.getState().uploadedFiles["Documents"]?.length > 0 && (
                                      <div className="space-y-2">
                                        <h5 className="text-sm font-medium text-slate-700">Uploaded Files:</h5>
                                        <div className="space-y-1 max-h-40 overflow-auto">
                                          {useUploadedFilesStore.getState().uploadedFiles["Documents"].map((file, idx) => (
                                            <div
                                              key={idx}
                                              className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded"
                                            >
                                              <FileText className="h-3.5 w-3.5" />
                                              <span className="truncate max-w-[150px]">{file.name}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            ) : (
                              <ChevronRight className="h-4 w-4 text-slate-400 flex-shrink-0" />
                            )}
                          </div> */}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
        </>
    )
}