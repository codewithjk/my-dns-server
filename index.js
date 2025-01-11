
const dgram = require('node:dgram');
const dnsPacket = require('dns-packet');

const server = dgram.createSocket('udp4')

const db = {
    "sprintflow.com": {
        type: "CNAME",
        data: "sprintflow.site"
    }
}

server.on("message", (msg, rinfo) => {
    const incomingReq = dnsPacket.decode(msg);
    const dbData = db[incomingReq.questions[0].name]
    console.log({
        msg: incomingReq.questions,
        rinfo
    })
    const res = dnsPacket.encode({
        id: incomingReq.id,
        flags: dnsPacket.AUTHORITATIVE_ANSWER,
        questions: incomingReq.questions,
        answers: [
            {
                type: dbData.type,
                class: "IN",
                name: incomingReq.questions[0].name,
                data: dbData.data
            }
        ]
    })
    server.send(res, rinfo.port, rinfo.address)
})

server.bind(53, () => {
    console.log("dns server is listening ")
})