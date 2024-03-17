import { Button, Flex, AlertDialog } from '@radix-ui/themes';
import { Dispatch, SetStateAction, useState } from 'react';
import { MyFile } from '../../model/interface/file.ts';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store.ts';

interface DialogActionFileProperties<T> {
  metaData: MyFile;
  setReRender: Dispatch<SetStateAction<boolean>>;
  title: string;
  IconComponent: React.ComponentType;
  actionColor:
    | 'tomato'
    | 'red'
    | 'ruby'
    | 'crimson'
    | 'pink'
    | 'plum'
    | 'purple'
    | 'violet'
    | 'iris'
    | 'indigo'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'jade'
    | 'green'
    | 'grass'
    | 'brown'
    | 'orange'
    | 'sky'
    | 'mint'
    | 'lime'
    | 'yellow'
    | 'amber'
    | 'gold'
    | 'bronze'
    | 'gray';
  actionLabel: string;
  callBackFn: (metaData: MyFile) => void;
  description?: string;
  dataToEdit?: T;
  setterCallBackFn?: (value: T) => void;
}

export default function DialogActionFile({
  title,
  description,
  IconComponent,
  actionColor,
  actionLabel,
  callBackFn,
  dataToEdit,
  setterCallBackFn,
}: Readonly<DialogActionFileProperties>) {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <button className='btn' style={{ backgroundColor: actionColor }}>
          <IconComponent />
        </button>
      </AlertDialog.Trigger>
      <AlertDialog.Content style={{ maxWidth: 450 }}>
        <AlertDialog.Title>{title}</AlertDialog.Title>
        <AlertDialog.Description size='2'>{description}</AlertDialog.Description>
        {dataToEdit && setterCallBackFn && (
          <input
            type='text'
            className='input input-bordered w-full max-w-xs'
            defaultValue={dataToEdit}
            onChange={(event_) => setterCallBackFn(event_.target.value as unknown as string)}
          />
        )}
        <Flex gap='3' mt='4' justify='end'>
          <AlertDialog.Cancel>
            <Button variant='soft' color='gray'>
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant='solid' color='red' onClick={callBackFn}>
              {actionLabel}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}
