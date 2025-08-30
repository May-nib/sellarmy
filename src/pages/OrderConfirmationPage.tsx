// src/pages/OrderConfirmationPage.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import supabaseClient from '../lib/supabaseClient';
//import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type Order = {
  id: string;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: string;
  created_at: string;
};

// Create a PDF-friendly version of the order confirmation
const createProfessionalPDF = (order: Order) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  
  // Add header with logo/company name
  pdf.setFillColor(0, 51, 3); // Dark green background
  pdf.rect(0, 0, pageWidth, 30, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Sellarmy', margin, 20);
  
  // Add title
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(24);
  pdf.text('Order Confirmation', margin, 50);
  
  // Add order details box
  pdf.setFillColor(245, 245, 245); // Light gray background
  pdf.roundedRect(margin, 60, contentWidth, 80, 3, 3, 'F');
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  
  // Order details
  pdf.setFont('helvetica', 'bold');
  pdf.text('Order Number:', margin + 10, 75);
  pdf.text('Customer Name:', margin + 10, 85);
  pdf.text('Order Total:', margin + 10, 95);
  pdf.text('Order Status:', margin + 10, 105);
  pdf.text('Order Date:', margin + 10, 115);
  
  pdf.setFont('helvetica', 'normal');
  pdf.text(order.order_number, margin + 50, 75);
  pdf.text(order.customer_name, margin + 50, 85);
  pdf.text(`$${order.total_amount.toFixed(2)}`, margin + 50, 95);
  pdf.text(order.status.charAt(0).toUpperCase() + order.status.slice(1), margin + 50, 105);
  pdf.text(new Date(order.created_at).toLocaleDateString(), margin + 50, 115);
  
  // Add thank you message
  pdf.setFontSize(14);
  pdf.text('Thank you for your purchase!', margin, 150);
  pdf.setFontSize(12);
  pdf.text('Your order has been received and is being processed.', margin, 160);
  pdf.text('You will receive an email confirmation shortly.', margin, 170);
  
  // Add footer
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text('For questions about your order, please contact our customer support.', margin, 250);
  pdf.text(`Generated on ${new Date().toLocaleDateString()}`, margin, 260);
  
  return pdf;
};

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingPdf, setSavingPdf] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      
      const { data, error } = await supabaseClient
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) {
        console.error('Error fetching order:', error);
      } else {
        setOrder(data);
      }
      setLoading(false);
    };

    fetchOrder();
  }, [orderId]);

  const saveAsPdf = async () => {
    if (!order) return;
    
    setSavingPdf(true);
    try {
      const pdf = createProfessionalPDF(order);
      pdf.save(`order-${order.order_number}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setSavingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Order Not Found</h2>
          <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
          <Link to="/" className="inline-block px-6 py-3 bg-green-800 text-white rounded-md hover:bg-green-700 transition">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* This is the visual representation for the user */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">Order Confirmed!</h1>
          <p className="text-gray-600 mb-6 text-center">Thank you for your purchase. Your order has been received and is being processed.</p>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h2 className="text-lg text-black font-semibold mb-4 text-center">Order Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Number:</span>
                <span className="font-medium text-black">{order.order_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer Name:</span>
                <span className="font-medium text-black">{order.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Total:</span>
                <span className="font-medium text-black">${order.total_amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Status:</span>
                <span className="font-medium text-black capitalize">{order.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Order Date:</span>
                <span className="font-medium text-black">{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-600 mb-6 text-center">
            You will receive an email confirmation shortly. For any questions about your order, please contact our customer support.
          </p>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="px-6 py-3 bg-green-800 text-white rounded-md hover:bg-green-700 transition text-center">
            Continue Shopping
          </Link>
          <button
            onClick={saveAsPdf}
            disabled={savingPdf}
            className="px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition flex items-center justify-center disabled:opacity-50"
          >
            {savingPdf ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                </svg>
                Save Order as PDF
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}