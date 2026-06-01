import { marked } from 'marked'
import DOMPurify from 'dompurify'

export default (content: string) => {
  return DOMPurify.sanitize(marked(content) as string)
}
