
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Terms of Service</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                By accessing and using our website, you accept and agree to be bound by the terms 
                and provision of this agreement.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Use License</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Permission is granted to temporarily download one copy of the materials on our website 
                for personal, non-commercial transitory viewing only.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Modify or copy the materials</li>
                <li>Use the materials for commercial purposes</li>
                <li>Attempt to reverse engineer any software</li>
                <li>Remove any copyright or proprietary notations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                We strive to provide accurate product information, but we do not warrant that 
                product descriptions or other content is accurate, complete, reliable, or error-free.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Orders and Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>All orders are subject to acceptance and availability</li>
                <li>Prices are subject to change without notice</li>
                <li>Payment must be received before order processing</li>
                <li>We reserve the right to cancel orders for any reason</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Shipping and Returns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Shipping times are estimates and not guaranteed. Returns must be made within 
                30 days of purchase in original condition.
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                In no event shall our company be liable for any damages arising out of the use 
                or inability to use our products or services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="mt-4 space-y-2 text-gray-700">
                <p>Email: legal@shop.com</p>
                <p>Phone: +91 9876543210</p>
                <p>Address: 123 Shopping Street, City, State 12345</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
