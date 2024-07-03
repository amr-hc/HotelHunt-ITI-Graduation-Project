<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use App\Http\Resources\PaymentResource;
use Srmklive\PayPal\Services\PayPal as PayPalClient;
use Srmklive\PayPal\Facades\PayPal;


class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return PaymentResource::collection(Payment::all());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0',
            'hotel_id' => 'required|exists:hotels,id',
        ]);
        Payment::create([
            'amount' => $request->amount,
            'hotel_id' => $request->hotel_id,
            'method' => 'cash'
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment $payment)
    {
        return new PaymentResource($payment);
    }



    public function update(Request $request, Payment $payment)
    {
        $payment->update($request->all());

        return response()->json(['message' => 'Payment updated successfully'],200);
    }

  
    public function destroy(Payment $payment)
    {
        $payment->delete();
    }

    public function createPayment(Request $request)
    {
        $request->validate([
            'value' => 'required|numeric|min:0',
        ]);

        $provider = PayPal::setProvider();
        $provider->setApiCredentials(config('paypal'));
        $paypalToken = $provider->getAccessToken();

        $order = [
            "intent" => "CAPTURE",
            "application_context" => [
                "return_url" => 'http://localhost:4200/owner/payment/paypal',
                "cancel_url" => route('paypal.cancel'),
            ],
            "purchase_units" => [
                [
                    "reference_id" => auth()->user()->hotels->id,
                    "description" => "Hotel payment",
                    "amount" => [
                        "currency_code" => "USD",
                        "value" => $request->value
                        ]
                ]
            ]
        ];

        $response = $provider->createOrder($order);

        if (isset($response['id'])) {
            foreach ($response['links'] as $link) {
                if ($link['rel'] === 'approve') {
                    return ["link"=>$link['href']];
                }
            }
        }

        return redirect()->route('paypal.cancel');
    }


    public function successPayment(Request $request)
{
    $provider = PayPal::setProvider();
    $provider->setApiCredentials(config('paypal'));
    $paypalToken = $provider->getAccessToken();

    $response = $provider->capturePaymentOrder($request->token);

    if (isset($response['status']) && $response['status'] == 'COMPLETED') {
        $hotel_id = $response['purchase_units'][0]['reference_id'];

        Payment::create([
            'method' => 'paypal',
            'hotel_id' => $hotel_id,
            'amount' => $response['purchase_units'][0]['payments']['captures'][0]['seller_receivable_breakdown']['net_amount']['value'],
        ]);

        return response()->json(['message' => 'Payment successful'], 200);
    }

    return response()->json(['message' => 'Payment failed'], 400);

}


    public function cancelPayment()
    {
        return response()->json(['message' => 'Payment cancelled'], 400);
    }

    public function getHotelPayments(Request $request)
    {
        $hotelId = auth()->user()->hotels->id;

        if (!$hotelId) {
            return response()->json(['message' => 'Hotel ID is required'], 400);
        }

        $payments = Payment::where('hotel_id', $hotelId)->get();

        if ($payments->isEmpty()) {
            return response()->json(['message' => 'No payments found for this hotel'], 404);
        }

        return PaymentResource::collection($payments);
    }
}


