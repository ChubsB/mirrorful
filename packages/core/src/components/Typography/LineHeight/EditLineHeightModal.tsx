import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Text,
} from '@chakra-ui/react'
import { useDisclosure } from '@chakra-ui/react'
import { AlertDialogDelete } from '@core/components/AlertDialogDelete'
import { TNamedToken, TUnits, Units } from '@core/types'
import { parseUnit } from '@core/utils/parseUnit'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

export function EditLineHeightModal({
  isOpen,
  isAdding,
  onClose,
  initialLineHeightVariant,
  onUpdateLineHeightVariant,
  onDeleteLineHeightVariant,
}: {
  isOpen: boolean
  isAdding: boolean
  onClose: () => void
  initialLineHeightVariant?: TNamedToken
  onUpdateLineHeightVariant: (newVariant: TNamedToken) => void
  onDeleteLineHeightVariant?: () => void
}) {
  const {
    isOpen: isAlertDialogOpen,
    onOpen: onDeleteAlertDialogOpen,
    onClose: onDeleteAlertDialogClose,
  } = useDisclosure()

  const [variantName, setVariantName] = useState<string>(
    initialLineHeightVariant?.name ?? ''
  )
  const [variantValue, setVariantValue] = useState<string>(
    initialLineHeightVariant?.token
      ? `${parseUnit(initialLineHeightVariant.token.value).rawValue}`
      : ''
  )

  const [id, setId] = useState<string>(
    initialLineHeightVariant?.token.id ?? uuidv4()
  )
  const [variantUnit, setVariantUnit] = useState<TUnits>(
    initialLineHeightVariant?.token
      ? parseUnit(initialLineHeightVariant.token.value).unit
      : ('px' as const)
  )

  const [error, setError] = useState<string | null>(null)
  const variantNameRef = useRef() as MutableRefObject<HTMLInputElement>
  const variantValueRef = useRef() as MutableRefObject<HTMLInputElement>

  const handleSave = () => {
    setError(null)
    if (variantName === '') {
      variantNameRef.current.focus()
      setError('Please fill out all fields.')
      return
    }

    if (variantValue === '') {
      variantValueRef.current.focus()
      setError('Please fill out all fields.')
      return
    }

    if (isNaN(Number(variantValue))) {
      variantValueRef.current.focus()
      setError('Value must be a number.')
      return
    }

    if (Number(variantValue) !== 0 && !Number(variantValue)) {
      variantValueRef.current.focus()
      setError('Please fill out all fields.')
      return
    }

    if (Number(variantValue) < 0) {
      variantValueRef.current.focus()
      setError('Minimum value of line height can be 0.')
      return
    }

    let newValue = `${variantValue}`
    if (variantUnit !== 'number') {
      newValue = `${variantValue}${variantUnit}`
    }

    onUpdateLineHeightVariant({
      name: variantName,
      token: {
        id,
        value: newValue,
        type: 'lineHeight',
      },
    })
    onClose()
  }

  useEffect(() => {
    if (!isOpen) {
      setVariantName(initialLineHeightVariant?.name ?? '')
      setVariantValue(
        initialLineHeightVariant?.token
          ? `${parseUnit(initialLineHeightVariant.token.value).rawValue}`
          : ''
      )
      setVariantUnit(
        initialLineHeightVariant?.token
          ? parseUnit(initialLineHeightVariant.token.value).unit
          : ('px' as const)
      )
      setId(initialLineHeightVariant?.token.id ?? uuidv4())
      setError(null)
    }
  }, [isOpen, initialLineHeightVariant])

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isAdding ? 'Add' : 'Edit'} Line Height Variant
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            css={{
              padding: '0px 32px 32px 32px',
            }}
          >
            <Box css={{ display: 'flex', flexDirection: 'column' }}>
              <FormControl>
                <FormLabel>Variant Name</FormLabel>
                <Input
                  ref={variantNameRef}
                  value={variantName}
                  onChange={(e) => setVariantName(e.target.value)}
                />
              </FormControl>

              <FormControl css={{ marginTop: '32px' }}>
                <FormLabel>Variant Value</FormLabel>
                <Input
                  ref={variantValueRef}
                  value={variantValue}
                  onChange={(e) => setVariantValue(e.target.value)}
                  type="number"
                />
              </FormControl>
              <FormControl css={{ marginTop: '32px' }}>
                <FormLabel>Variant Unit</FormLabel>
                <Select
                  value={variantUnit}
                  onChange={(event) => {
                    setVariantUnit(event.target.value as TUnits)
                  }}
                >
                  {Units.map((unit, index) => {
                    return (
                      <option key={index} value={unit}>
                        {unit}
                      </option>
                    )
                  })}
                </Select>
              </FormControl>
            </Box>
            {error && (
              <Text color="red.500" css={{ marginTop: 18 }}>
                {error}
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            {onDeleteLineHeightVariant && (
              <>
                <Button
                  onClick={() => onDeleteAlertDialogOpen()}
                  colorScheme="red"
                >
                  Delete Variant
                </Button>
                <AlertDialogDelete
                  tokenName={variantName}
                  isOpen={isAlertDialogOpen}
                  onClose={onDeleteAlertDialogClose}
                  onDelete={() => onDeleteLineHeightVariant()}
                />
              </>
            )}
            <Button onClick={handleSave} css={{ marginLeft: '12px' }}>
              Save Variant
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
