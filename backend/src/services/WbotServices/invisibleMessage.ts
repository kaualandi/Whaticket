import Message from "../../models/Message";
import Ticket from "../../models/Ticket";
import { getIO } from "../../libs/socket";
import { UUID, UUIDV4 } from "sequelize";
import { randomUUID } from "crypto";

interface Data {
  body: string;
  ticket: Ticket;
  quotedMsg?: Message;
}

async function invisibleMessage({ body, ticket, quotedMsg }: Data) {
  const messageCreated = await Message.create({
    id: randomUUID(),
    body,
    fromMe: true,
    read: true,
    ack: 3,
    ticketId: ticket.id,
    quotedMsgId: quotedMsg ? quotedMsg.id : null,
    number: ticket.contact.number,
    contactId: ticket.contactId,
    companyId: ticket.companyId,
    mediaType: "extendedTextMessage",
    visibility: false
  });

  const message = await Message.findByPk(messageCreated.id, {
    include: [
      "contact",
      {
        model: Ticket,
        as: "ticket",
        include: ["contact", "queue"]
      },
      {
        model: Message,
        as: "quotedMsg",
        include: ["contact"]
      }
    ]
  });

  const io = getIO();
  io.emit(`company-${ticket.companyId}-appMessage`, {
    action: "create",
    message,
    ticket: message.ticket,
    contact: message.ticket.contact
  });
}

export default invisibleMessage;
