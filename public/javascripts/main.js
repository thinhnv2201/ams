function stringToSlug(s) {
  var slug;

  slug = s.toLowerCase();
  //Đổi ký tự có dấu thành không dấu
  slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
  slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
  slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
  slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
  slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
  slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
  slug = slug.replace(/đ/gi, 'd');
  //Xóa các ký tự đặt biệt
  slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
  //Đổi khoảng trắng thành ký tự gạch ngang
  slug = slug.replace(/ /gi, "-");
  //Đổi nhiều ký tự gạch ngang liên tiếp thành 1 ký tự gạch ngang
  //Phòng trường hợp người nhập vào quá nhiều ký tự trắng
  slug = slug.replace(/\-\-\-\-\-/gi, '-');
  slug = slug.replace(/\-\-\-\-/gi, '-');
  slug = slug.replace(/\-\-\-/gi, '-');
  slug = slug.replace(/\-\-/gi, '-');
  //Xóa các ký tự gạch ngang ở đầu và cuối
  slug = '@' + slug + '@';
  slug = slug.replace(/\@\-|\-\@|\@/gi, '');
  //In slug ra textbox có id “slug”
  return slug;
}

function genSlug(s, selector) {
  var slug = stringToSlug(s);
  $(selector).val(slug);
}

function confirmAction(text, url) {
  $('body').addClass('overflow-hidden');

  confirmAgree = function() {
    window.location.href = url;
  }

  confirmCancel = function() {
    let popupConfirm = document.getElementById('popup-confirm');

    if (popupConfirm) {
      $('body').removeClass('overflow-hidden');
      popupConfirm.remove();
    }
  }

  let html = '<div id="popup-confirm" class="confirm-action content-center"><div class="content-center-container"><div class="confirm-action-container"><div class="icon icon-question"><i class="fa fa-question-circle"></i></div><div class="confirm-message">' + text + '</div><hr/><div class="confirm-actions"><button class="btn btn-success confirm-agree" onclick="confirmAgree()"><i class="fa fa-check"></i>&nbsp;Đồng ý</button><button class="btn btn-default confirm-disagree" onclick="confirmCancel()"><i class="fa fa-ban"></i>&nbsp;Thoát</button></div></div></div></div>';
  document.getElementById('html-bottom').innerHTML += html;

  return false;
}

function onSelectAbg(value) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        let response = JSON.parse(this.response);
        if (response.data) {
          let data = response.data;

          let options = '<option value="">Chọn tòa nhà</option>';

          for(let i=0; i<data.length; i++) {
            options += '<option value="' + data[i]._id + '">' + data[i].buildingName + '</option>'
          }

          $('#choosen-apartment-building').empty().append(options).trigger("chosen:updated");
        }
        // Action to be performed when the document is read;
      }
  };
  xhttp.open('GET', '/api/abg/list-building/' + value, true);
  xhttp.send();
}

function addUserToApartment(apartmentId) {
  let firstName = document.getElementsByName('firstName')[0],
    lastName = document.getElementsByName('lastName')[0],
    userName = document.getElementsByName('userName')[0],
    email = document.getElementsByName('email')[0];
    password = document.getElementsByName('password')[0],
    confirmPassword = document.getElementsByName('confirmPassword')[0],
    params = 'firstName=' + firstName.value + '&lastName=' + lastName.value + 
    '&userName=' + userName.value + '&email=' + email.value +
    '&password=' + password.value + '&confirmPassword=' + confirmPassword.value +
    '&apartmentId=' + apartmentId;

  let http = new XMLHttpRequest();
  let url = "/api/apartment/add-new-user";
  http.open("POST", url, true);
  
  //Send the proper header information along with the request
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  
  http.onreadystatechange = function() {//Call a function when the state changes.
    if(http.readyState == 4 && http.status == 200) {
      let dataRes = JSON.parse(this.response);

      console.log('dataRes', dataRes);
      if (dataRes.errorCode === 0) {
        window.location.reload();
        return;
      }

      if (dataRes.errors) {
        if (dataRes.errors.firstName) {
          firstName.parentNode.classList.remove('has-error');
          firstName.parentNode.classList.add('has-error');
          if (firstName.parentNode.lastChild.classList.contains('help-block')) {
            firstName.parentNode.lastChild.remove();
          }
          firstName.parentNode.innerHTML += '<div class="help-block">' + dataRes.errors.firstName.msg + '</div>';
        }
        if (dataRes.errors.lastName) {
          lastName.parentNode.classList.remove('has-error');
          lastName.parentNode.classList.add('has-error');
          if (lastName.parentNode.lastChild.classList.contains('help-block')) {
            lastName.parentNode.lastChild.remove();
          }
          lastName.parentNode.innerHTML += '<div class="help-block">' + dataRes.errors.lastName.msg + '</div>';
        }
        if (dataRes.errors.userName) {
          userName.parentNode.classList.remove('has-error');
          userName.parentNode.classList.add('has-error');
          if (userName.parentNode.lastChild.classList.contains('help-block')) {
            userName.parentNode.lastChild.remove();
          }
          userName.parentNode.innerHTML += '<div class="help-block">' + dataRes.errors.userName.msg + '</div>';
        }
        if (dataRes.errors.email) {
          email.parentNode.classList.remove('has-error');
          email.parentNode.classList.add('has-error');
          if (email.parentNode.lastChild.classList.contains('help-block')) {
            email.parentNode.lastChild.remove();
          }
          email.parentNode.innerHTML += '<div class="help-block">' + dataRes.errors.email.msg + '</div>';
        }
        if (dataRes.errors.password) {
          password.parentNode.classList.remove('has-error');
          password.parentNode.classList.add('has-error');
          if (password.parentNode.lastChild.classList.contains('help-block')) {
            password.parentNode.lastChild.remove();
          }
          password.parentNode.innerHTML += '<div class="help-block">' + dataRes.errors.password.msg + '</div>';
        }
        if (dataRes.errors.confirmPassword) {
          confirmPassword.parentNode.classList.remove('has-error');
          confirmPassword.parentNode.classList.add('has-error');
          if (confirmPassword.parentNode.lastChild.classList.contains('help-block')) {
            confirmPassword.parentNode.lastChild.remove();
          }
          confirmPassword.parentNode.innerHTML += '<div class="help-block">' + dataRes.errors.confirmPassword.msg + '</div>';
        }
      }
    }
  }
  http.send(params);
}

function addBuilding(abgId) {
  let buildingName = document.getElementsByName('buildingName')[0],
    floor = document.getElementsByName('floor')[0],
    area = document.getElementsByName('area')[0],
    manager = document.getElementsByName('manager')[0],
    status = document.getElementsByName('status')[0];
    params = 'buildingName=' + buildingName.value + '&floor=' + floor.value + 
    '&area=' + area.value + '&manager=' + manager.value + '&status=' + status.value +
    '&abgId=' + abgId;

  let http = new XMLHttpRequest();
  let url = "/api/abg/add-new-building";
  http.open("POST", url, true);
  
  //Send the proper header information along with the request
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  
  http.onreadystatechange = function() {//Call a function when the state changes.
    if(http.readyState == 4 && http.status == 200) {
      let dataRes = JSON.parse(this.response);

      console.log('dataRes', dataRes);
      if (dataRes.errorCode === 0) {
        window.location.reload();
        return;
      }

      if (dataRes.errors) {
        if (dataRes.errors.buildingName) {
          buildingName.parentNode.classList.remove('has-error');
          buildingName.parentNode.classList.add('has-error');
          if (buildingName.parentNode.lastChild.classList.contains('help-block')) {
            buildingName.parentNode.lastChild.remove();
          }
          buildingName.parentNode.innerHTML += '<div class="help-block">' + dataRes.errors.buildingName.msg + '</div>';
        }
        if (dataRes.errors.floor) {
          floor.parentNode.classList.remove('has-error');
          floor.parentNode.classList.add('has-error');
          if (floor.parentNode.lastChild.classList.contains('help-block')) {
            floor.parentNode.lastChild.remove();
          }
          floor.parentNode.innerHTML += '<div class="help-block">' + dataRes.errors.floor.msg + '</div>';
        }
        if (dataRes.errors.area) {
          area.parentNode.classList.remove('has-error');
          area.parentNode.classList.add('has-error');
          if (area.parentNode.lastChild.classList.contains('help-block')) {
            area.parentNode.lastChild.remove();
          }
          area.parentNode.innerHTML += '<div class="help-block">' + dataRes.errors.area.msg + '</div>';
        }
        if (dataRes.errors.manager) {
          manager.parentNode.classList.remove('has-error');
          manager.parentNode.classList.add('has-error');
          if (manager.parentNode.lastChild.classList.contains('help-block')) {
            manager.parentNode.lastChild.remove();
          }
          manager.parentNode.innerHTML += '<div class="help-block">' + dataRes.errors.manager.msg + '</div>';
        }
      }
    }
  }
  http.send(params);
}

function addApartment(buildingId) {
  let apartmentName = document.getElementsByName('apartmentName')[0],
    floor = document.getElementsByName('floor')[0],
    area = document.getElementsByName('area')[0],
    manager = document.getElementsByName('manager')[0],
    status = document.getElementsByName('status')[0];
    params = 'apartmentName=' + apartmentName.value + '&floor=' + floor.value + 
    '&area=' + area.value + '&manager=' + manager.value + '&status=' + status.value +
    '&buildingId=' + buildingId;

  let http = new XMLHttpRequest();
  let url = "/api/building/add-new-apartment";
  http.open("POST", url, true);
  
  //Send the proper header information along with the request
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  
  http.onreadystatechange = function() {//Call a function when the state changes.
    if(http.readyState == 4 && http.status == 200) {
      let dataRes = JSON.parse(this.response);

      console.log('dataRes', dataRes);
      if (dataRes.errorCode === 0) {
        window.location.reload();
        return;
      }

      if (dataRes.errors) {
        if (dataRes.errors.apartmentName) {
          apartmentName.parentNode.classList.remove('has-error');
          apartmentName.parentNode.classList.add('has-error');
          if (apartmentName.parentNode.lastChild.classList.contains('help-block')) {
            apartmentName.parentNode.lastChild.remove();
          }
          apartmentName.parentNode.innerHTML += '<div class="help-block">' + dataRes.errors.apartmentName.msg + '</div>';
        }
        if (dataRes.errors.floor) {
          floor.parentNode.classList.remove('has-error');
          floor.parentNode.classList.add('has-error');
          if (floor.parentNode.lastChild.classList.contains('help-block')) {
            floor.parentNode.lastChild.remove();
          }
          floor.parentNode.innerHTML += '<div class="help-block">' + dataRes.errors.floor.msg + '</div>';
        }
        if (dataRes.errors.area) {
          area.parentNode.classList.remove('has-error');
          area.parentNode.classList.add('has-error');
          if (area.parentNode.lastChild.classList.contains('help-block')) {
            area.parentNode.lastChild.remove();
          }
          area.parentNode.innerHTML += '<div class="help-block">' + dataRes.errors.area.msg + '</div>';
        }
        if (dataRes.errors.manager) {
          manager.parentNode.classList.remove('has-error');
          manager.parentNode.classList.add('has-error');
          if (manager.parentNode.lastChild.classList.contains('help-block')) {
            manager.parentNode.lastChild.remove();
          }
          // manager.parentNode.innerHTML += '<div class="help-block">' + dataRes.errors.manager.msg + '</div>';
        }
      }
    }
  }
  http.send(params);
}

function selectExistingUserToApartment(apartmentId) {
  let apartmentUser = document.getElementsByName('apartmentUser')[0],
    params = '';

  let options = apartmentUser.options, opt, result = [];

  for (var i=0, iLen=options.length; i<iLen; i++) {
    opt = options[i];

    if (opt.selected) {
      result.push(opt.value || opt.text);
    }
  }

  params = 'apartmentUser=' + JSON.stringify(result) + '&apartmentId=' + apartmentId;

  let http = new XMLHttpRequest();
  let url = "/api/apartment/add-exist-user";
  http.open("POST", url, true);
  
  //Send the proper header information along with the request
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  
  http.onreadystatechange = function() {//Call a function when the state changes.
    if(http.readyState == 4 && http.status == 200) {
      let dataRes = JSON.parse(this.response);

      if (dataRes.errorCode === 0) {
        window.location.reload();
        return;
      }

      if (dataRes.errors) {
        
      }
    }
  }
  http.send(params);
}

function downloadFileImport(url) {
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(xhttp.readyState == 4 && xhttp.status == 200) {
      let dataRes = JSON.parse(this.response);

      if (dataRes.success) {
        window.location.href = dataRes.fileUrl;
      }
    }
  };
  xhttp.open('GET', url, true);
  xhttp.send();
}

function downloadCostFileImport(url) {
  let chosenAbEl = document.getElementById('choosen-apartment-building');

  if (!chosenAbEl || (chosenAbEl && !chosenAbEl.value)) {
    alert('Vui long chọn khu chung cư và tòa nhà');
    return;
  }

  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if(xhttp.readyState == 4 && xhttp.status == 200) {
      let dataRes = JSON.parse(this.response);

      if (dataRes.success) {
        window.location.href = dataRes.fileUrl;
      }
    }
  };
  xhttp.open('GET', url + '?buildingId=' + chosenAbEl.value, true);
  xhttp.send();
}

function importFileAbg(selector) {
  if (selector.files && selector.files[0]) {
    let file = selector.files[0];
    let formData = new FormData();
    formData.append('fileImport', file);

    let xhr = new XMLHttpRequest();
    // Open the connection.
    xhr.open('POST', '/api/media/upload-excel-file', true);
    xhr.onload = function () {
      if (xhr.status === 200) {
        let dataRes = JSON.parse(this.response);
        if (dataRes.success) {
          let tableEl = document.querySelector('#abgDataImport table tbody');
          let showData = document.getElementById('abg-data-import-file');
          let tableHtml = '';
          if (tableEl) {
            for (let i=0, len = dataRes.data.length; i<len; i++) {
              tableHtml += '<tr><td>' + dataRes.data[i].ten_chung_cu + '</td><td>' + dataRes.data[i].dia_chi + '</td></tr>';
            }

            tableEl.innerHTML = tableHtml;

            if (showData) {
              showData.click();
            }

            let abgSubmitData = document.getElementById('abg-submit-data');
            if (abgSubmitData) {
              abgSubmitData.addEventListener('click', function() {
                /**
                 * Submit data
                 */
                let xhttp = new XMLHttpRequest();
                let params = 'data=' + JSON.stringify(dataRes.data);
                xhttp.onreadystatechange = function() {
                  if(xhttp.readyState == 4 && xhttp.status == 200) {
                    let dataRes = JSON.parse(this.response);

                    if (dataRes.success) {
                      window.location.reload();
                    }
                  }
                };
                xhttp.open('POST', '/api/abg/submit-data', true);
                //Send the proper header information along with the request
                xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xhttp.send(params);
              }.bind(dataRes));
            }
          }
        }
      } else {
        alert('An error occurred!');
      }
    };
    xhr.send(formData);
  }
}

function selectAllApartments() {
  console.log(111);
  $('#listSendTo option').attr('selected', true).trigger("chosen:updated");
}

function toggleSelect() {
  let f = document.getElementById('select-download-option');
  f.classList.toggle('hidden');
}

$(document).on('click', 'input', function() {
  $(this).parent().removeClass('has-error');
  $(this).nextAll('.help-block').remove();
});
