import {
  Card,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Image
} from '@heroui/react'
import { ArrowUpTrayIcon } from '@heroicons/react/24/solid'
import { useRef, useState, useCallback } from 'react'
import { images } from '@/variables/data'

type UploadButtonProps = {
  label?: string
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default'
  size?: 'sm' | 'md' | 'lg'
  onPress?: () => void
  isDisabled?: boolean
}

type UploadAreaProps = {
  onFileAccepted?: (file: File) => void
}

type UploadFileProps = {
  onFileAccepted?: (file: File | null) => void
}

function UploadArea({ onFileAccepted }: UploadAreaProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [newFile, setNewFile] = useState<File | null>(null)

  const acceptedFormats = '.xlsx,.csv,.xls'

  const handleFile = useCallback((selectedFile: File | null) => {
    setError(null)
  
    if (!selectedFile) return

    const isValidFile = acceptedFormats.split(',').some(format => {
      return selectedFile.name.toLowerCase().endsWith(format)
    })

    if (!isValidFile) {
      setError('Invalid format. Only xlsx, csv and xls are allowed.')
      onFileAccepted?.(null)
      setNewFile(null)
      return
    }
  
    onFileAccepted?.(selectedFile)
    setNewFile(selectedFile)
  }, [onFileAccepted])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null)

    e.currentTarget.value = ''
  }
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()

    handleFile(e.dataTransfer.files?.[0] ?? null)
  }
  const onDragOver = (e: React.DragEvent) => e.preventDefault()

  return (
    <Card
      className='relative p-4 text-center bg-slate-600/10 '
      onDrop={onDrop}
      onDragOver={onDragOver}
    >
      <input
        ref={inputRef}
        type='file'
        accept={acceptedFormats}
        onChange={onChange}
        aria-label='Select a file'
        className='absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0'
      />

      <div className='flex justify-center'>
        <Image
          isBlurred
          className='pointer-events-none'
          src={images.upload}
          height={200}
          width={200}
          alt='Click to select a file'
        />
      </div>

      <div className='mt-3 text-sm text-slate-300'>
        {
            error ? 
            (<div className='mt-2 text-red-400'>{error}</div>) :
            newFile ? (
              <div className='mt-2'>
                <span className='font-medium text-white'>Selected:</span>{' '}
                {newFile.name}{' '}
                <span className='text-slate-400'>
                  ({Math.round(newFile.size / 1024)} KB)
                </span>
              </div>
            ) :
            (
              <>
                <p>Click (or drag & drop) to select a file</p>
                <span className='text-slate-400'>
                  Only accepts {acceptedFormats.replace(/\./g, '')}
                </span>
              </>
            )
        }
      </div>
    </Card>
  )
}

function UploadButton({
  label = 'Upload',
  color = 'primary',
  size = 'sm',
  onPress,
  isDisabled = false,
}: UploadButtonProps) {
  return (
    <Button
      onPress={ onPress }
      color={ color }
      size={ size }
      className='w-full'
      isDisabled={isDisabled}
      variant='flat'
      endContent={<ArrowUpTrayIcon className='h-4 w-4' />}
    >
      {label}
    </Button>
  )
}

function UploadFile({ onFileUpload }: UploadFileProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [file, setFile] = useState<File | null>(null)

  const handleSend = () => {
    if (!file) return

    onFileUpload?.(file)
    setFile(null)
    onOpenChange(false)
  }

  return (
    <>
      <UploadButton label='Upload File' color='primary' onPress={ onOpen } />

      <Modal backdrop='blur' isOpen={ isOpen } onOpenChange={ onOpenChange }>
        <ModalContent>
          {
            () => (
              <>
                <ModalHeader className='flex flex-col gap-1'>Select your file</ModalHeader>
                <ModalBody>
                  <UploadArea onFileAccepted={setFile} />
                </ModalBody>

                <ModalFooter>
                  <UploadButton label='Send' onPress={handleSend} isDisabled={!file} />
                </ModalFooter>
              </>
            )
          }
        </ModalContent>
      </Modal>
    </>
  )
}

export { UploadFile, UploadButton }