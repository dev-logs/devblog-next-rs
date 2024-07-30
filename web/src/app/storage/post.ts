import { Post } from "contentlayer/generated"

export default class PostLocalStorage {
  constructor() {}

  async addVotedPost(title: string) {
    let array: string[] = JSON.parse(localStorage.getItem('votedPosts') || '[]')
    array = array.filter((it: string) => it.trim() !== title)
    const newArray = [...array, title]
    localStorage.setItem('votedPosts', JSON.stringify(newArray))
    return newArray
  }

  async getVotedPosts() {
    let array: string[] = JSON.parse(localStorage.getItem('votedPosts') || '[]')
    return array
  }

  async isVoted(title: string) {
    const votedPosts = await this.getVotedPosts()
    const isVoted = !!votedPosts.find((it: string) => it === title)
    console.log('is voted', title, isVoted)
    return isVoted
  }
}
