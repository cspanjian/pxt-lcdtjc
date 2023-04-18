
/**
 * LCD显示屏的扩展包 TJC
 * 还是只能显示英文和数字，不过英文的标点可以显示了。中文还是不行
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
//文本行号
const enum TextLineNum {
    //% block="第一行"
    Line1 = 1,
    //% block="第二行"
    Line2 = 2,
    //% block="第三行"
    Line3 = 3,
    //% block="第四行"
    Line4 = 4,
    //% block="第五行"
    Line5 = 5,
    //% block="第六行"
    Line6 = 6,
    //% block="第七行"
    Line7 = 7
}
//% weight=10 color=#1d8045 icon="\uf108" block="LCDTjc"
namespace LCDTjc {
    let cmdEndingBuff: Buffer = Buffer.fromArray([0XFF, 0XFF, 0XFF]);
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
            pinRX,
            pinTX,
            BaudRate.BaudRate9600
        )
        basic.pause(1500);
        //先发如下指令来清理屏幕
        let buff: Buffer = Buffer.fromArray([0X00, 0XFF, 0XFF, 0XFF]);
        serial.writeBuffer(buff);
        basic.pause(100);
        //显示初始化结束的信息
        showString(TextLineNum.Line1, "LCD was initialized successfully!");
    }

    /**
     * 在LCD上显示字符串
    */
    //% weight=90
    //% blockId="showString" 
    //% block="在 %lineNum 显示字符串 %text"
    export function showString(lineNum: TextLineNum, text: string): void {
        sendTxtCmd(lineNum,text);
    }  

    //% weight=80
    //% blockId="clearLCD" block="清空屏幕"
    export function clearLCD(): void {
        showString(TextLineNum.Line1, "");
        showString(TextLineNum.Line2, "");
        showString(TextLineNum.Line3, "");
        showString(TextLineNum.Line4, "");
        showString(TextLineNum.Line5, "");
        showString(TextLineNum.Line6, "");
        showString(TextLineNum.Line7, "");
    }

    //生成给LCD发的命令
    function sendTxtCmd(lineNum: TextLineNum, text: string): void{
        let tVar = "t0";
        switch (lineNum) {
            case TextLineNum.Line1:
                tVar = "t0";
                break;
            case TextLineNum.Line2:
                tVar = "t1";
                break;
            case TextLineNum.Line3:
                tVar = "t2";
                break;
            case TextLineNum.Line4:
                tVar = "t3";
                break;
            case TextLineNum.Line5:
                tVar = "t4";
                break;
            case TextLineNum.Line6:
                tVar = "t5";
                break;
            case TextLineNum.Line7:
                tVar = "t6";
                break;
        }
        let cmdTxt = "main."+tVar+".txt=\""+text+"\"";
        let buff = Buffer.fromUTF8(cmdTxt);
        buff = buff.concat(cmdEndingBuff);
        serial.writeBuffer(buff);
        basic.pause(50);
    }
}
