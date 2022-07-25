function visAlarmStatus () {
    if (alarmStatus == 0) {
        basic.showLeds(`
            # # # # #
            # . . . #
            # . . . #
            # . . . #
            # # # # #
            `)
    } else {
        basic.showLeds(`
            . . # . .
            . . # . .
            . . # . .
            . . # . .
            . . # . .
            `)
    }
}
function flippAlarmStatus () {
    status = alarmStatus
    if (status == 0) {
        if (slåttAvKortId == forrigeKortId) {
            alarmStatus = 1
        }
    } else {
        alarmStatus = 0
        slåttAvKortId = forrigeKortId
    }
    visAlarmStatus()
}
function lesKort (denneId: string) {
    if (denneId != "No NFC Card!") {
        basic.showLeds(`
            . . . . .
            . . . . .
            . . # . .
            . . . . .
            . . . . .
            `)
    }
    if (denneId != forrigeKortId) {
        forrigeKortId = denneId
        serial.writeLine(denneId)
        if (sjekkGodkjentKort(forrigeKortId) == true) {
            flippAlarmStatus()
        }
    }
    visAlarmStatus()
}
function sjekkGodkjentKort (kortId: string) {
    return godkjenteKort.indexOf(kortId) > -1
}
function sjekkAlarm () {
    if (pins.digitalReadPin(DigitalPin.P0) == 1) {
        basic.showLeds(`
            # . . . #
            . # . # .
            . . # . .
            . # . # .
            # . . . #
            `)
        for (let index = 0; index < 5; index++) {
            music.playMelody("C5 - C5 - C5 - C5 - ", 177)
        }
    } else {
        visAlarmStatus()
    }
}
let forrigeKortId = ""
let slåttAvKortId = ""
let status = 0
let alarmStatus = 0
let godkjenteKort: string[] = []
music.setVolume(255)
godkjenteKort = [
"ac897449",
"f3d5bd16",
"73ebbb16",
"ecd6706d"
]
alarmStatus = 1
basic.forever(function () {
    if (alarmStatus == 1) {
        sjekkAlarm()
    }
    lesKort(NFC.getUid())
})
