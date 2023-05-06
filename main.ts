
/**
 * LCD显示屏的扩展包 TJC
 * 只能显示英文、数字、英文标点
 * 中文不行的原因在于：microbit认为自己的cpu处理能力比较弱，所以不支持中文的处理，
 * 所以Buffer.fromUTF8拿到的其实是把中文当作ASCII码处理后的结果
 * 如果要显示几个特定的中文文字，可以拿USART HMI取得编码后，直接用serial写字节数组的方式写出来即可
 * 但是无法自由的使用任何文字中文文字
 * 本质是microbit不对中文文字解码成UTF8字节数组
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
    let cmdEndingBuffer: Buffer = Buffer.fromArray([0XFF, 0XFF, 0XFF]);
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

    /**
     * 在LCD上显示byte array代表的字符串
    */
    //% weight=80
    //% blockId="showByteArrayString" 
    //% block="在 %lineNum 显示字节数组表示的字符串 %byteArray"
    export function showByteArrayString(lineNum: TextLineNum, byteArray: number[]): void {
        sendBufferCmd(lineNum, Buffer.fromArray(byteArray));
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
        sendBufferCmd(lineNum, Buffer.fromUTF8(text));
    }

    //生成给LCD发的命令
    function sendBufferCmd(lineNum: TextLineNum, byteBuffer: Buffer): void {
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
    //    let cmdTxt = "main." + tVar + ".txt=\"" + text + "\"";
        let cmdTxt = "main." + tVar + ".txt=\"";
        serial.writeString(cmdTxt);
        serial.writeBuffer(byteBuffer);
        cmdTxt = "\"";
        serial.writeString(cmdTxt);
        serial.writeBuffer(cmdEndingBuffer);
        basic.pause(50);
    }
}
