import mongoose from 'mongoose';

interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
  // Flips to true once we've verified the Stripe session actually paid
  // and published PaymentCreated - keeps a page reload or a retried
  // verification call from firing that event twice for the same payment.
  confirmed: boolean;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      required: true,
      type: String,
    },
    stripeId: {
      required: true,
      type: String,
    },
    confirmed: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret: any) {
      ret.id = ret._id;
        delete ret?._id;
      },
    },
  }
);

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  'Payment',
  paymentSchema
);

export { Payment };
