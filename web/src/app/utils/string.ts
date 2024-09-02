export function isValidEmail(email: string): boolean {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailPattern.test(email)
}

export function staticResourceUrl(url: string, opts: {defaultPath: string} = {defaultPath: ''}) {
  return `${process.env.NEXT_PUBLIC_PATH_PREFIX || opts.defaultPath}/${url}`
}