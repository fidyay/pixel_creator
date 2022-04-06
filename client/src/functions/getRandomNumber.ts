export default function getRandomNumber(min: number, max: number) {
    if (max <= min) new Error("min can't be larger than max")
    return Math.random() * (max - min) + min
}