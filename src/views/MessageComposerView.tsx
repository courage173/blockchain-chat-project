import {
  ChangeEvent,
  FormEvent,
  ReactElement,
  createRef,
  useCallback,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import Button from "../components/Button";
import { useClient } from "../hooks/useClient";
import { Conversation } from "../model/db";
import { sendMessage } from "../model/messages";
import { ContentTypeText } from "@xmtp/xmtp-js";
import {
  Attachment,
  ContentTypeAttachment,
} from "@xmtp/content-type-remote-attachment";
import AttachmentPreviewView from "./AttachmentPreviewView";
import { MessageContent } from "./MessageCellView";
import { shortAddress } from "../util/shortAddress";
import { ContentTypeReply, Reply } from "@xmtp/content-type-reply";

export default function MessageComposerView({
  conversation,
}: {
  conversation: Conversation;
}): ReactElement {
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | undefined>();
  const [textInput, setTextInput] = useState("");

  const fileField = createRef<HTMLInputElement>();

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const client = useClient()!;

  function onSubmit(e: FormEvent) {
    e.preventDefault();

    (async () => {
      setLoading(true);

      // check for input
      if (textInput || attachment) {
        const finalContent = textInput || attachment;
        const finalContentType = textInput
          ? ContentTypeText
          : ContentTypeAttachment;
        // send regular message
        await sendMessage(client, conversation, finalContent, finalContentType);
      }

      // clear inputs
      setAttachment(undefined);
      setTextInput("");
      setLoading(false);
    })();
  }

  async function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files && e.target.files[0];

    if (!file) {
      return;
    }

    const arrayBuffer = await file.arrayBuffer();

    setAttachment({
      filename: file.name,
      mimeType: file.type,
      data: new Uint8Array(arrayBuffer),
    });

    window.scroll({ top: 10000, behavior: "smooth" });
  }

  const getHeightBasedOnNewLine = () => {
    // Split the text input value based on newline characters
    const lines = (textInput.match(/\n/g) || []).length;
    // Count the number of lines
    if (lines === 1) return 30;
    return lines * 24 + 30;
  };

  const getHeight = () => {
    // Get the actual width of the text area
    const textAreaWidth = getWidthOfTextArea();

    const letterCount = textInput.length;

    const lineBreakCount = (textInput.match(/\n/g) || []).length;

    const averageLetterWidth = 8;

    const averageLineHeight = 24; // Adjust this value as needed

    const estimatedHeight =
      Math.ceil(
        ((letterCount + lineBreakCount) * averageLetterWidth) / textAreaWidth
      ) * averageLineHeight;

    const minHeight = 30;

    return Math.max(minHeight, estimatedHeight);
  };

  const getWidthOfTextArea = () => {
    return inputRef.current ? inputRef.current.clientWidth : 500;
  };

  return (
    <div className="absolute left-0 right-0 bottom-0 p-4 bg-[#252329]">
      <input
        ref={fileField}
        type="file"
        onChange={onChange}
        style={{ position: "absolute", marginLeft: "-10000px" }}
      />
      <form className="flex space-x-2 items-end" onSubmit={onSubmit}>
        <div className=" flex-grow border rounded-[10px] bg-black border-zinc-700 p-2">
          {attachment && (
            <AttachmentPreviewView
              attachment={attachment}
              onDismiss={() => {
                setAttachment(undefined);
              }}
            />
          )}
          <div className="flex space-x-2 items-center">
            <button
              type="button"
              className="bg-blue-500 w-8 h-8 text-white rounded-full"
              onClick={() => fileField.current?.click()}
            >
              +
            </button>
            <textarea
              // type='text'
              rows={1}
              placeholder={
                attachment ? "Press Send to send attachment" : "Type a message"
              }
              className="flex-grow outline-none bg-black resize-none placeholder-center"
              name="text"
              autoComplete="off"
              disabled={!!attachment}
              value={textInput}
              ref={inputRef}
              onChange={(e) => setTextInput(e.target.value)}
              style={{
                maxHeight: "200px",
                height: Math.max(getHeight(), getHeightBasedOnNewLine()) + "px",
              }}
            />
            <Button type="submit">Send</Button>
          </div>
        </div>
      </form>
    </div>
  );
}
