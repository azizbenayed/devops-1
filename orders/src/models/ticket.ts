import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from './order';

interface TicketAttrs {
  id: string;
  title: string;
  price: number;
  quantity?: number;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  quantity: number;
  version: number;
  hasAvailability(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<TicketDoc | null>;
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
      min: 0,
    },
    // How many units of this ticket can be sold in total. Defaults to 1
    // so tickets synced from before this field existed keep behaving like
    // the old single-buyer model.
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
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

ticketSchema.set('versionKey', 'version');
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
    quantity: attrs.quantity,
  });
};
ticketSchema.methods.hasAvailability = async function () {
  // this === the ticket document that we just called 'hasAvailability' on.
  // Count every order that's still holding a unit (reserved, awaiting
  // payment, or already paid) and compare against how many units this
  // ticket has - lets several different clients each buy their own unit
  // instead of the first buyer locking out everyone else.
  const activeOrdersCount = await Order.countDocuments({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return activeOrdersCount < this.quantity;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
