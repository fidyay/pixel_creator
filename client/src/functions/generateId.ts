const generateId = () => {
    const mls = new Date().getTime() as number
    return (Math.random() * mls).toString(36).replace(/\./g,"")
}

export default generateId