import { getAllTags, getAllDocsWithTags } from "@/lib/docs"
import TagsClient from "./tags-client"

export default function TagsPage() {
  const tags = getAllTags()
  const docs = getAllDocsWithTags()

  return <TagsClient tags={tags} docs={docs} />
}
