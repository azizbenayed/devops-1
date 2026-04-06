import amqp, { Channel } from "amqplib";

class RabbitWrapper {

  private _channel?: Channel;
  connection: any;

  get client() {
    if (!this._channel) {
      throw new Error("RABBIT connection needs to be initialized first!");
    }

    return this._channel;
  }

  async connect(url: string) {

    if (!this.connection) {

      this.connection = await amqp.connect(url);

      this._channel = await this.connection.createChannel();
    }
  }
}

export const rabbitWrapper = new RabbitWrapper();
