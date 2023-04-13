
/**
 * LCD显示屏的扩展包
 */
//文字大小
const enum LCDFontSize {
    //% block="小"
    Minimal = 16,  //DC16
    //% block="中"
    Medium = 24,   //DC24
    //% block="大"
    Maximal = 32.  //DC32
}
//文字颜色
const enum LCDFontColor {
    //% block="黑"
    Black = 0,
    //% block="红"
    Red = 1,
    //% block="绿"
    Green = 2,
    //% block="蓝"
    Blue = 3,
    //% block="黄"
    Yellow = 4,
    //% block="灰"
    Grey = 7,
    //% block="白"
    White = 15
}
//% weight=10 color=#1d8045 icon="\uf108" block="LCD"
namespace LCD {
    

    let receivedLen = 0;
    let receivedBuffer = pins.createBuffer(25);

    /**
     * 初始化LCD
     * 这里的RX指的是LCD的RX和micro:bit连接的引脚，TX指的是LCD的TX和micro:bit连接的引脚，不需要做TX和RX互换
     * @param pinTX to pinTX ,eg: SerialPin.P13
     * @param pinRX to pinRX ,eg: SerialPin.P14
    */
    //% weight=100
    //% blockId="initLCD" block="初始化LCD模块，LCD模块的 TX 连接到 %pinTX | RX 连接到 %pinRX"
    export function initLCD(pinTX: SerialPin, pinRX: SerialPin): void {
        serial.redirect(
            pinTX,
            pinRX,
            BaudRate.BaudRate115200
        )
    }

    /**
     * 在LCD上显示字符串
    */
    //% weight=90
    //% blockId="showStringFull" 
    //% block="显示字符串 %text X坐标 %posX Y坐标 %posY 字号 %fontSize 颜色 %fontColor"
    export function showStringFull(text: string, posX: number, posY: number, 
                    fontSize: LCDFontSize, fontColor: LCDFontColor): void {
        let cmdTxt = "";
        switch(fontSize){
            case LCDFontSize.Minimal:
                cmdTxt += "DC16(";
                break;
            case LCDFontSize.Medium:
                cmdTxt += "DC24(";
                break;
            case LCDFontSize.Maximal:
                cmdTxt += "DC32(";
                break;
            default:
                cmdTxt += "DC16(";
        }
        cmdTxt += posX + "," + posY + ",'" + text + "'," + fontColor +");\r\n";
        
        sendShowTextCmdToLCD(cmdTxt);
    }  

    //% advanced=true shim=LCD::sendShowTextCmdToLCD
    function sendShowTextCmdToLCD(text: string): void {
        return 
    }
}
