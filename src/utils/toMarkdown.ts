import { marked } from 'marked'

export default (content: string) => {
  return marked(content)
}
