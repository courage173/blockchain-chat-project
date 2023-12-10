import { FormEvent, ReactElement, createRef, useState } from 'react';
import { Link, redirect, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Button from '../components/Button';
import { startConversation } from '../model/conversations';
import { useClient } from '../hooks/useClient';
import { ModalInterface } from '../types/obj-types';

export default function NewConversationView({
  setShow,
}: ModalInterface): ReactElement {
  const client = useClient()!;

  // We're using an uncontrolled component here because we don't need to update
  // anything as the user is typing.
  //
  // See https://react.dev/learn/manipulating-the-dom-with-refs#best-practices-for-dom-manipulation-with-refs
  const addressInputRef = createRef<HTMLInputElement>();

  const [error, setError] = useState<string | undefined>();
  const [addresses, setAddresses] = useState<string[]>([]);

  const navigate = useNavigate();

  function validateAddress(): string | undefined {
    const address = addressInputRef.current?.value || '';

    if (address.trim().length == 0) {
      addressInputRef.current?.classList.add('horizontal-shake');
      setTimeout(() => {
        addressInputRef.current?.classList.remove('horizontal-shake');
      }, 1000);

      addressInputRef.current?.focus();

      return;
    }

    return address;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    const address = validateAddress();
    if (!address) return;

    try {
      const conversation = await startConversation(client, address);
      navigate(`/c/${conversation.topic}`);
    } catch (e) {
      setError(String(e));
    }
  }

  function onAdd() {
    const address = validateAddress();
    if (!address) {
      return;
    }

    setAddresses((addresses) => [address, ...addresses]);

    addressInputRef.current!.value = '';
    addressInputRef.current?.focus();
  }

  return (
    <div className='p-4'>
      {/* <Header>
        <div className='flex justify-between'>
          <h1>Make a new conversation</h1>
          <Link className='text-blue-600' to='/'>
            Go Back
          </Link>
        </div>
      </Header> */}
      <div className=''>
        <form onSubmit={onSubmit} className='space-y-4'>
          {error && <div className='p-4 border rounded mt-2'>{error}</div>}

          <label className='block'>
            <span className='block text-xs my-2'>
              Who {addresses.length > 0 && 'else '}do you want to message with?
            </span>

            <input
              autoFocus
              ref={addressInputRef}
              type='text'
              className='border p-2 w-full  rounded shadow-sm dark:bg-black'
              placeholder='Enter user crypto address'
            ></input>
          </label>
          <label className='space-x-4 flex justify-between'>
            <Button type='submit'>Start Conversation</Button>
            <button
              onClick={() => setShow(false)}
              className='bg-white text-red-500 px-2 rounded-lg'
            >
              close
            </button>
          </label>
        </form>
      </div>
    </div>
  );
}
