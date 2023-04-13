#include "pxt.h"
using namespace pxt;
namespace LCD {
    //因为microbit默认是utf8编码，但是我的LCD里面是GB2312字符集，所以在给LCD发命令前，需要把utf8字符串转为GB2312字符串
    //写C++太难了，所以这里的utf8_string是已经拼接好命令的完整字符串，然后这里是直接发命令给LCD了
    //%
    void sendShowTextCmdToLCD(String utf8_string){
        char gb2312_string[512];
        iconv_t iconv_handler = iconv_open("GB2312", "UTF-8");
        if (iconv_handler == (iconv_t)(-1)) { //打开iconv失败
            return;
        }

        char *input_buffer = utf8_string->getUTF8Data();
        size_t input_length = utf8_string->getUTF8Size();

        char *output_pointer = gb2312_string;
        size_t output_length = sizeof(gb2312_string);
        //output_length 参数表示输出缓冲区的长度，即在进行字符集转换后，还剩下多少空间可以写入输出的字符
        size_t result = iconv(iconv_handler, &input_buffer, &input_length, &output_pointer, &output_length);
        if (result == (size_t)(-1)) { //转换失败
            iconv_close(iconv_handler);
            return;
        }
        size_t convertedByteCount = sizeof(gb2312_string) - output_length;
        gb2312_string[convertedByteCount] = '\0'; 

        iconv_close(iconv_handler);

        uBit.serial.send((uint8_t*) gb2312_string, convertedByteCount);
        fiber_sleep(80); //暂停80ms，等待命令执行完毕

        return; 
    }    
}