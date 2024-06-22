export const TASKS = {
    POST_TITLE: 0,
    POST_FOOTER: 1
}

export const getTask = () => [
    import('../title'),
    import('../footer'),
    new Promise((r, rj) => setTimeout(r, 2000)) // wait for canvas to load
]
