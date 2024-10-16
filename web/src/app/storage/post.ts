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
    const array: string[] = JSON.parse(localStorage.getItem('votedPosts') || '[]')
    return array
  }

  async isVoted(title: string) {
    const votedPosts = await this.getVotedPosts()
    const isVoted = !!votedPosts.find((it: string) => it === title)
    return isVoted
  }
}
