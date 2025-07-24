import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState, useContext } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, CreditCard, Shield, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";
import { LanguageContext } from "@/i18n";
import { LanguageToggle } from "@/components/common/LanguageToggle";

// Load Stripe
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ amount, onPaymentSuccess }: { amount: number, onPaymentSuccess: () => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const { t } = useContext(LanguageContext);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      toast({
        title: t('checkout.paymentFailed'),
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: t('checkout.paymentSuccessful'),
        description: t('checkout.thankYou'),
      });
      onPaymentSuccess();
    }
    
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-blue-600 hover:bg-blue-700"
        size="lg"
      >
        {isProcessing ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
            <span>{t('checkout.processing')}</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>{t('checkout.payNow', { amount: amount.toString() })}</span>
          </div>
        )}
      </Button>
    </form>
  );
};

export default function CheckoutPage() {
  const [, setLocation] = useLocation();
  const { t } = useContext(LanguageContext);
  const [clientSecret, setClientSecret] = useState("");
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const amount = 2500; // $2,500 for basic implementation

  useEffect(() => {
    // Create PaymentIntent when page loads
    apiRequest("POST", "/api/create-payment-intent", { 
      amount: amount,
      metadata: {
        description: "Nebusis ControlCore Basic Implementation",
        tier: "basic"
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        console.error("Error creating payment intent:", error);
      });
  }, []);

  const handlePaymentSuccess = () => {
    setPaymentSuccessful(true);
  };

  const goBack = () => {
    setLocation("/pricing");
  };

  if (paymentSuccessful) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle className="text-2xl text-green-600">
              {t('checkout.paymentComplete')}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              {t('checkout.paymentCompleteDescription')}
            </p>
            <Button 
              onClick={() => setLocation("/")}
              className="w-full"
            >
              {t('checkout.returnHome')}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-600">{t('checkout.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={goBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{t('common.back')}</span>
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                {t('checkout.title')}
              </h1>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>{t('checkout.orderSummary')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {t('pricing.baseImplementation')}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {t('pricing.baseImplementationDescription')}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ${amount.toLocaleString()}
                  </span>
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{t('pricing.completeCososPlatform')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{t('pricing.virtualTraining')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{t('pricing.ticketSupport')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{t('pricing.technicalDocumentation')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{t('pricing.includedUpdates')}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-semibold">
                    <span>{t('checkout.total')}</span>
                    <span>${amount.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                {t('checkout.securePayment')}
              </h4>
              <p className="text-sm text-blue-800">
                {t('checkout.securePaymentDescription')}
              </p>
            </div>
          </div>

          {/* Payment Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>{t('checkout.paymentDetails')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm amount={amount} onPaymentSuccess={handlePaymentSuccess} />
                </Elements>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}