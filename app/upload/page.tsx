import { AppHeader } from '@/components/app-header';
import { UploadForm } from '@/components/upload-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function UploadPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-2xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold font-headline">Upload a New Product</CardTitle>
                    <CardDescription className="pt-2">
                        Submit your product for review. Once approved, it will appear in the main listing. All fields are required.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UploadForm />
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}
