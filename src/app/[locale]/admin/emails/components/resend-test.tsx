"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Loader2, Mail, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { testResendConnection } from "./actions";
import { useState } from "react";

export function ResendTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    domains?: any[];
  } | null>(null);

  const handleTest = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await testResendConnection();
      setResult(response);
    } catch (error) {
      setResult({
        success: false,
        message:
          error instanceof Error ? error.message : "Une erreur est survenue",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Test de Connexion Resend
        </CardTitle>
        <CardDescription>
          Vérifiez que votre configuration Resend fonctionne correctement
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleTest} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Test en cours...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Tester la connexion Resend
            </>
          )}
        </Button>

        {result && (
          <Alert
            className={`mt-6 ${result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            {result.success ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription
              className={result.success ? "text-green-800" : "text-red-800"}
            >
              {result.message}
              {result.domains && result.domains.length > 0 && (
                <div className="mt-2">
                  <strong>Domaines configurés:</strong>
                  <ul className="mt-1 list-disc list-inside">
                    {result.domains.map((domain: any, index: number) => (
                      <li key={index}>
                        {domain.name} - {domain.status}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
