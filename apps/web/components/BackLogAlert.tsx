"use client"
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@workspace/ui/components/alert';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@workspace/ui/components/alert-dialog';
import { AlertCircle } from 'lucide-react';

interface Backlog {
  lot: string;
  date: string;
  amount: string;
  project: string;
}

interface ProcessedBacklog extends Backlog {
  daysOverdue: number;
  severity: string;
}

interface BackLogAlertProps {
  backlogs: Backlog[];
}

// This component can be imported into your existing code
const BackLogAlert = ({ backlogs }: BackLogAlertProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [overdueBacklogs, setOverdueBacklogs] = useState<ProcessedBacklog[]>([]);
  const [criticalBacklogs, setCriticalBacklogs] = useState<ProcessedBacklog[]>([]);
  const [highBacklogs, setHighBacklogs] = useState<ProcessedBacklog[]>([]);
  const [mediumBacklogs, setMediumBacklogs] = useState<ProcessedBacklog[]>([]);
  
  useEffect(() => {
    // Run this check when component mounts or backlogs change
    if (backlogs && backlogs.length > 0) {
      processBacklogs();
    }
  }, [backlogs]);
  
  const processBacklogs = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Process and categorize backlogs
    const processedBacklogs: ProcessedBacklog[] = backlogs.map(backlog => {
      const dueDate = new Date(backlog.date);
      const diffTime = today.getTime() - dueDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let severity = "";
      if (diffDays >= 90) severity = "critical";
      else if (diffDays >= 60) severity = "high";
      else if (diffDays >= 30) severity = "medium";
      
      return {
        ...backlog,
        daysOverdue: diffDays,
        severity: severity
      };
    });
    
    // Filter only overdue backlogs (30+ days)
    const filtered = processedBacklogs.filter(b => b.severity);
    
    if (filtered.length > 0) {
      setOverdueBacklogs(filtered);
      setCriticalBacklogs(filtered.filter(b => b.severity === "critical"));
      setHighBacklogs(filtered.filter(b => b.severity === "high"));
      setMediumBacklogs(filtered.filter(b => b.severity === "medium"));
      setIsOpen(true);
    }
  };
  
  // Helper functions
  const formatCurrency = (amount: number | string): string => {
    return parseFloat(amount.toString()).toLocaleString('en-US', {
      style: 'currency',
      currency: 'PHP'
    });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const getSeverityColor = (severity: string): string => {
    switch(severity) {
      case "critical": return "bg-red-100";
      case "high": return "bg-orange-100";
      case "medium": return "bg-yellow-100";
      default: return "";
    }
  };
  
  const getSeverityTextColor = (severity: string): string => {
    switch(severity) {
      case "critical": return "text-red-600";
      case "high": return "text-orange-600";
      case "medium": return "text-yellow-600";
      default: return "";
    }
  };
  
  const getSeverityLabel = (severity: string): string => {
    switch(severity) {
      case "critical": return "3+ months";
      case "high": return "2+ months";
      case "medium": return "1+ month";
      default: return "";
    }
  };
  
  // If no overdue backlogs, don't render anything
  if (overdueBacklogs.length === 0) {
    return null;
  }
  
  return (
    <>
      {/* Persistent alert that stays visible on the dashboard */}
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="ml-2">Critical Backlog Alert</AlertTitle>
        <AlertDescription>
          You have {overdueBacklogs.length} lot payment{overdueBacklogs.length > 1 ? 's' : ''} overdue by more than 30 days
          {criticalBacklogs.length > 0 && `, including ${criticalBacklogs.length} critical (3+ months)`}.
        </AlertDescription>
      </Alert>
      
      {/* Modal dialog that appears on login */}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="max-w-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Overdue Lot Payments</AlertDialogTitle>
            <AlertDialogDescription>
              The following lot payments are overdue and require attention based on severity:
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="flex gap-2 mb-2">
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1"></span>
              <span className="text-xs">3+ months (Critical)</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-orange-500 mr-1"></span>
              <span className="text-xs">2+ months (High)</span>
            </div>
            <div className="flex items-center">
              <span className="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-1"></span>
              <span className="text-xs">1+ month (Medium)</span>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto py-2">
            {/* Critical Backlogs */}
            {criticalBacklogs.map((backlog, index) => (
              <div key={`critical-${index}`} className={`border-t hover:bg-red-50 ${getSeverityColor(backlog.severity)} p-4 mb-4 rounded-lg shadow-sm`}>
                <h3 className="font-bold text-lg mb-2">{backlog.project} - {backlog.lot}</h3>
                <p className="text-gray-700">Due Date: <span className="font-sm">{formatDate(backlog.date)}</span></p>
                <p className="text-gray-700">Amount: <span className="font-sm">{formatCurrency(backlog.amount)}</span></p>
                <p className={`font-sm ${getSeverityTextColor(backlog.severity)}`}>Days Overdue: {backlog.daysOverdue}</p>
                <p className={`font-sm ${getSeverityTextColor(backlog.severity)}`}>Severity: {getSeverityLabel(backlog.severity)}</p>
              </div>
            ))}

            {/* High Severity Backlogs */}
            {highBacklogs.map((backlog, index) => (
              <div key={`high-${index}`} className={`border-t hover:bg-orange-50 ${getSeverityColor(backlog.severity)} p-4 mb-4 rounded-lg shadow-sm`}>
                <h3 className="font-bold text-lg mb-2">{backlog.project} - {backlog.lot}</h3>
                <p className="text-gray-700">Due Date: <span className="font-medium">{formatDate(backlog.date)}</span></p>
                <p className="text-gray-700">Amount: <span className="font-medium">{formatCurrency(backlog.amount)}</span></p>
                <p className={`font-medium ${getSeverityTextColor(backlog.severity)}`}>Days Overdue: {backlog.daysOverdue}</p>
                <p className={`font-medium ${getSeverityTextColor(backlog.severity)}`}>Severity: {getSeverityLabel(backlog.severity)}</p>
              </div>
            ))}

            {/* Medium Severity Backlogs */}
            {mediumBacklogs.map((backlog, index) => (
              <div key={`medium-${index}`} className={`border-t hover:bg-yellow-50 ${getSeverityColor(backlog.severity)} p-4 mb-4 rounded-lg shadow-sm`}>
                <h3 className="font-bold text-lg mb-2">{backlog.project} - {backlog.lot}</h3>
                <p className="text-gray-700">Due Date: <span className="font-medium">{formatDate(backlog.date)}</span></p>
                <p className="text-gray-700">Amount: <span className="font-medium">{formatCurrency(backlog.amount)}</span></p>
                <p className={`font-medium ${getSeverityTextColor(backlog.severity)}`}>Days Overdue: {backlog.daysOverdue}</p>
                <p className={`font-medium ${getSeverityTextColor(backlog.severity)}`}>Severity: {getSeverityLabel(backlog.severity)}</p>
              </div>
            ))}
          </div>
          
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel>Dismiss</AlertDialogCancel>
            <Link 
              href="/buyerlots" 
              className="inline-flex items-center justify-center px-4 py-2 rounded font-medium text-white bg-blue-600 hover:bg-blue-700"
              target="_blank"
              rel="noopener noreferrer"
              prefetch={false}
            >
              View Payment Details
            </Link>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BackLogAlert;