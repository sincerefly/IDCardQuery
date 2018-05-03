function query() {
  
  let idcard = document.getElementById("idcard").value;

  // 城市编码, 出生日期
  let city_id = idcard.substring(0, 6);
  let birth = idcard.substring(6, 14);
  let sex = parseInt(idcard[16] % 2);

  // 根据规则校验身份证是否符合规则
  let idcard_tuple = idcard.split('').map((s) => parseInt(s));
  let coefficient = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
  let sum_value=0;
  for (let i=0; i<17; i++) {
    sum_value = sum_value + idcard_tuple[i] * coefficient[i];
  }
  let remainder = sum_value % 11;
  let maptable = {0: '1', 1: '0', 2: 'x', 3: '9', 4: '8', 5: '7', 6: '6', 7: '5', 8: '4', 9: '3', 10: '2'}

  let isValid;
  if (maptable[remainder] == idcard[17]) {
    isValid = true;
  } else {
    isValid = false;
  }
  let url = "http://127.0.0.1:8000/data.json";
  $.getJSON( url, {
      format: "json"
  }).done(function( data ) {
      let city_name = data[city_id];

      // 输出
      if (isValid) {
        document.getElementById("valid").innerHTML = "<身份证合法>";
        if (sex == 1) {
          document.getElementById("sex").innerHTML = "男";
        } else {
          document.getElementById("sex").innerHTML = "女";
        }

        document.getElementById("birth").innerHTML = birth;
        document.getElementById("addr").innerHTML = city_name;
      } else {
        document.getElementById("valid").innerHTML = "<身份证非法>";
      }
  });
}