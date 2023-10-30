function hideId(id) {
  const e = document.getElementById(id);
  if (!!e) e.style.display="none" 
}

onUiLoaded(async () => {
  hideId('interrogate')  // 隐藏 CLIP 按钮
  hideId('txt2img_open_folder')  // 隐藏 打开文件夹 按钮
  hideId('save_txt2img')  // 隐藏 保存 按钮
  hideId('save_zip_txt2img')  // 隐藏 压缩 按钮
})
