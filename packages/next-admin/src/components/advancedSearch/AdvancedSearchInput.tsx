import { ChangeEvent } from 'react'
import { UIQueryBlock } from '../../utils/advancedSearch'
import BaseInput from '../inputs/BaseInput'
import { useAdvancedSearchContext } from './AdvancedSearchContext'

type Props = {
  uiBlock: UIQueryBlock
}

const AdvancedSearchInput = ({ uiBlock }: Props) => {
  const { updateUiBlock } = useAdvancedSearchContext()

  if (uiBlock.type !== 'filter') {
    return null;
  }

  const onChange = (evt: ChangeEvent<HTMLInputElement>) => {
    updateUiBlock({
      ...uiBlock,
      value: evt.target.value,
    })
  }

  return (
    <BaseInput type={uiBlock.contentType === "datetime" ? "datetime-local" : uiBlock.contentType} className="flex w-fit" onChange={onChange} value={uiBlock.value ?? ""} />
  )
}

export default AdvancedSearchInput
