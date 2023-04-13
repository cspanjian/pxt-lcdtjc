
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
    Maximal = 32  //DC32
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
    //% block="浅灰"
    LightGrey = 7,
    //% block="深灰"
    DarkGrey = 8,
    //% block="白"
    White = 15
}
//屏幕亮度
const enum LCDLightness{
    //% block="暗"
    Minimal = 200,  
    //% block="中"
    Medium = 128,   
    //% block="亮"
    Maximal = 0  
}
//% weight=10 color=#1d8045 icon="\uf108" block="LCD"
namespace LCD {
    let lcdDir=0; //屏幕方向：每次调用旋转屏幕，都是换一个方向，数字在0，1，2，3之间轮动

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
        basic.pause(1000);
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
        cmdTxt += posX + "," + posY + ",'" + text + "'," + fontColor.toString() +");\r\n";
        
        sendCmdToLCD(cmdTxt);
    }  

    //% weight=80
    //% blockId="clearLCD" block="用颜色 %fontColor 清空屏幕"
    export function clearLCD(fontColor: LCDFontColor): void {
        let cmdTxt = "CLR(" + fontColor.toString() +"); \r\n";
        sendCmdToLCD(cmdTxt);
    }

    //% weight=80
    //% blockId="tuneLCDLightness" block="调整屏幕亮度为 %lightness"
    export function tuneLCDLightness(lightness: LCDLightness): void {
        let cmdTxt = "BL(" + lightness.toString() + "); \r\n";
        sendCmdToLCD(cmdTxt);
    }

    //% weight=80
    //% blockId="rotateLCD" block="旋转屏幕"
    export function rotateLCD(): void {
        lcdDir +=1;
        if (lcdDir >=4){
            lcdDir=0;
        }
        let cmdTxt = "DIR(" + lcdDir + "); \r\n";
        sendCmdToLCD(cmdTxt);
    }

    //向LCD发送指令
    function sendCmdToLCD(cmdTxt: string){
        serial.writeString(cmdTxt);
        basic.pause(100);
    }
}
