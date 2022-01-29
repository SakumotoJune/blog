# HTMl Canvas对象的二三事

1. drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)

![drawImage](https://mdn.mozillademos.org/files/225/Canvas_drawimage.jpg)

 canvas的大小为width,height

 在部分浏览器中，不会自动换算，后8个参数的范围都是[0, width]和[0, height]，不然会绘画失败

2. 超出浏览器内存，canvas返回null，显示失败

3. 移动端模糊原因

    * DPR
      * 物理像素（DP）：设备像素，常听到的设备分辨率即为物理像素
      * 设备独立像素（DIP）：也称逻辑像素，比如Iphone4和Iphone3GS的尺寸都是3.5寸，iphone4的物理分辨率是640*980，而3gs只有320*480，假如我们按照真实布局取绘制一个320px宽度的图像时，在iphone4上只有一半有内容，剩下的一半则是一片空白，为了避免这种问题，我们引入了逻辑像素，将两种手机的逻辑像素都设置为320px
      * 设备像素比（DPR）：设备像素比 = 设备像素 / 逻辑像素。DPR = DP / DIP

    * canvas的width和height属性

      style中的width和height分别代表canvas这个元素在界面上所占据的宽高，即样式上的宽高
      attribute中的width和height则代表canvas实际像素的宽高

      可以想象成图片。
      如果style.width= 320, width = 460,相当于2个canvas的像素填充1个逻辑像素

      屏幕模糊原因，dpr为2，相当于1个css像素由4个物理像素组成，而canvas的两个像素都为320，换算一下就是1个canvas像素填充4个物理像素，而图片在这个过程中会就近取色，也是导致模糊的原因。

      取相近颜色是为了图像更为柔和



