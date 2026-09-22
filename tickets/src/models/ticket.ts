import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
  quantity: number;
}

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  // How many units the admin listed, and how many of those are currently
  // tied up by an active order (created/awaiting payment/paid). Multiple
  // clients can each buy their own unit until reservedCount reaches
  // quantity - this replaces the old single `orderId` lock that only let
  // one buyer ever reserve a ticket.
  quantity: number;
  reservedCount: number;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    reservedCount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret: any) {
      ret.id = ret._id;
        delete ret?._id;
        ret.remaining = Math.max(0, (ret.quantity ?? 1) - (ret.reservedCount ?? 0));
      },
    },
  }
);
ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
