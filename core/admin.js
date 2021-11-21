class Admin {
  constructor(url) {
    this.url = url;
  }

  get_url(so = 2) {
    return this.url.split("/")[so]; //['','admin','dashboard','index']
  }

  name_url() {
    return this.get_url(2)
  }

  url_file() {
    return `partials/main`;
  }

  view_sidebar() {
    var json = [
      { name: "Bảng điều khiển", icon: "home", link: "dashboard" },
      { name: "Sản phẩm ", icon: "shopping-cart", link: "product" },
      { name: "Thành viên", icon: "user", link: "user" },
    ];

    var str = ``;

    str += ` <div id="sidebar-menu" class="main_menu_side hidden-print main_menu">
        <div class="menu_section"><ul class="nav side-menu">`;

    json.forEach((e) => {
      str +=
        ` <li><a href="/admin/` +
        e.link +
        `/index"><i class="fa fa-` +
        e.icon +
        `"></i>` +
        e.name +
        `</a></li>`;
    });

    str += `</ul></div></div>`;

    return str;
  }

  view_main(array = [], value_search, sumPage, pageNumber) {
    var str = `<div class="right_col" role="main">`;
    if (this.get_url(2) == "dashboard") {
      str += this.view_report();
      str += this.view_network();
    } else {
      if (this.get_url(3) == "add") {
        str += this.view_form(array);
      }else if (this.get_url(3) == "edit"){
        str += this.view_form_edit(array);
      }else {
        str += this.view_table(array, value_search, sumPage, pageNumber);
      }
    }

    str += `</div>`;

    return str;
  }

  name_module(key = "") {
    var name = "";
    switch (key) {
      case "category":
        name = "Category";
        break;
      case "product":
        name = "Product";
        break;
      case "user":
        name = "User";
        break;

      default:
        name = "No name";
        break;
    }
    return name;
  }

  name_property(key = "") {
    var name = "";
    switch (key) {
      case "name":
        name = "Tên";
        break;
      case "slug":
        name = "Slug";
        break;
      case "price":
        name = "Giá";
        break;
      case "parents":
        name = "Cha";
        break;
      case "content":
        name = "Nội dung";
        break;
      case "role":
        name = "Vai trò";
        break;
      case "username":
        name = "Tên đăng nhập";
        break;
      case "password":
        name = "Mật khẩu";
        break;
      case "email":
        name = "Email";
        break;
      case "phone":
        name = "Số điện thoại";
        break;

      default:
        name = "No name";
        break;
    }
    return name;
  }

  view_table(
    array,
    value_search = "",
    sumPage,
    pageNumber
  ) {
    //Thẻ bọc ngoài
    var str = `<div class="row"><div class="x_panel">`;

    //tittle
    str +=
      `<div class="page-title">
        <div class="title_left">
          <h3>` + this.name_module(this.get_url(2)) + `<a href="admin/` +
              this.get_url(2) + `/add" class="btn btn-primary btn-sm">
              <i class="fa fa-plus"></i> Thêm
          </a>
          </h3>
        </div>

        <div class="title_right">
          <div class="col-md-5 col-sm-5  form-group pull-right top_search">
            <form>
              <div class="input-group">
                <input type="text" name="search" value="` + value_search + `" class="form-control" placeholder="Nhập từ khóa...">
                <span class="input-group-btn">
                  <button class="btn btn-default" type="submit">Tìm!</button>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>`;
    // Main
    str += `<div class="x_content">
        <div class="table-responsive">
          <table class="table table-striped jambo_table bulk_action">`;

    if (this.get_url(2) == 'product') {
      str += this.view_product(array);
    } else if (this.get_url(2) == 'user') {
      str += this.view_user(array);
    }

    //Đóng table
    str += `</table></div></div>`;

    if (array != '') {

        //Phân trang
        str += `
          <div class="col-sm-5">
            <div class="dataTables_info" id="datatable-checkbox_info" role="status" aria-live="polite">Showing 1 to 10 of 57 entries</div>
          </div>
          <div class="col-sm-7">
            <div class="dataTables_paginate paging_simple_numbers" id="datatable_paginate">
                <ul class="pagination">`;
        str += this.pagination(sumPage, pageNumber);
        str += `
                </ul>
            </div>
          </div>`;

        //Đóng main + bọc ngoài
        str += `</div></div>`;
    }


    return str;
  }
  view_product(array = []) {
    var status = "";
    var str = "";
    //thead table
    str += `<thead>
              <tr class="headings">
                <th class="text-center">
                  <input type="checkbox" id="check-all" class="flat" />
                </th>
                <th class="column-title text-center">Hình ảnh</th>
                <th class="column-title">Tên</th>
                <th class="column-title text-center">Danh mục</th>
                <th class="column-title text-center">Trạng thái</th>
                <th class="column-title no-link last text-center"><span class="nobr">Chức năng</span>
                </th>
                <th class="bulk-actions" colspan="7">
                  <a class="antoo" style="color: #fff; font-weight: 500">Bulk Actions ( <span class="action-cnt"> </span> )
                    <i class="fa fa-chevron-down"></i></a>
                </th>
              </tr>
            </thead>`;

    //tbody table

    array.forEach((e) => {
      str +=
        `<tr class="even pointer" id= "delete_id_` +
        e._id +
        `">
                    <td class="a-center text-center">
                      <input type="checkbox" class="flat" name="table_records" />
                    </td>
                    <td class="text-center">
                    <img src="/uploads/abc.img" width ="20">    
                    <button type="button" class="btn btn-round btn-secondary btn-sm" style="padding:2px 6px 0" data-toggle="modal" data-target=".bs-example-modal-lg">
                    <i class="fa fa-plus" ></i>
                    </button>
                    </td>
                    <td>` +
        e.name +
        `</td>
                    <td class="text-center"></td>`;

      status = e.status == true ? "checked" : "";

      str +=
        `<td class="text-center">
                      <input type="checkbox" id = "status_` +
        e._id +
        `" ` +
        status +
        ` onclick = "js_status('` +
        e._id +
        `')">
                      </td>`;

      str +=
        `<td class="last text-center">
                      <a href="admin/` + this.get_url(2) + `/edit/` + e._id + `" class="btn btn-round btn-info btn-sm">Sửa</a>
                      <a href="" class="btn btn-round btn-danger btn-sm" data-toggle="modal" data-target=".bs-example-modal-sm" onclick="js_delete('` + e.name + `','` + e._id + `')"></i>Xóa</a> 
                    </td>
                  </tr>`;
    });
    str += `</tbody>`;
    return str;
  }

  view_user(array = []) {
    var status = "";
    var str = "";
    //thead table
    str += `<thead>
              <tr class="headings">
                <th class="text-center">
                  <input type="checkbox" id="check-all" class="flat" />
                </th>
                <th class="column-title text-center">Hình ảnh</th>
                <th class="column-title">Tên đăng nhập</th>
                <th class="column-title text-center">Trạng thái</th>
                <th class="column-title no-link last text-center"><span class="nobr">Chức năng</span>
                </th>
              </tr>
            </thead>`;

    //tbody table

    array.forEach((e) => {
      str +=
        `<tr class="even pointer" id= "delete_id_` + e._id +`">
                    <td class="a-center text-center">
                      <input type="checkbox" class="flat" name="table_records" />
                    </td>
                    <td class="text-center">
                    <img src="/uploads/abc.img" width ="20">    
                    <button type="button" class="btn btn-round btn-secondary btn-sm" style="padding:2px 6px 0" data-toggle="modal" data-target=".bs-example-modal-lg">
                    <i class="fa fa-plus" ></i>
                    </button>
                    </td>
                    <td>` +e.name +`</td>`;

      status = e.status == true ? "checked" : "";

      str +=
        `<td class="text-center">
           <input type="checkbox" id = "status_` + e._id +
           `" ` + status + ` onclick = "js_status('` + e._id + `')">
          </td>`;

      str +=
        `<td class="last text-center">
                      <a href="#" class="btn btn-round btn-info btn-sm">Sửa</a>
                      <a href="#" class="btn btn-round btn-info btn-sm">Đổi mật khẩu</a>
                      <a href="" class="btn btn-round btn-danger btn-sm" data-toggle="modal" data-target=".bs-example-modal-sm" onclick="js_delete('` + e.name +`','` +e._id +`')"></i>Xóa</a> 
                    </td>
                  </tr>`;
    });
    str += `</tbody>`;
    return str;
  }
//Phân trang
  pagination(sumPage = 0, pageNumber = 0) {
    var str = "",
      active = "";
    // 1.Trang đầu tiên
    str +=
      ' <li class="paginate_button previous disabled" id="datatable_previous"><a href="admin/' +
      this.get_url(2) +
      '/index/1" aria-controls="datatable" data-dt-idx="0" tabindex="0">First</a></li>';
    //2.Về trước 1 trang trang
    str +=
      ' <li class="paginate_button previous disabled" id="datatable_previous"><a href="#" aria-controls="datatable" data-dt-idx="0" tabindex="0">Previous</a></li>';
    //3.Danh sách trang trang
    for (let index = 1; index <= sumPage; index++) {
      //Xét active
      if (index == 1) {
        if (pageNumber == 0 || pageNumber == index) {
          active = "active";
        }
      } else if (pageNumber == index) {
        active = "active";
      } else {
        active = "";
      }
      //----end xét active
      str += '<li class="paginate_button ' + active + '">';
      str +=
        '<a href="admin/' +
        this.get_url(2) +
        "/index/" +
        index +
        '" aria-controls="datatable" data-dt-idx="2" tabindex="0">' +
        index +
        "</a>";
      str += "</li>";
    }
    //4.Về sau 1 trang
    str +=
      '<li class="paginate_button previous disabled" id="datatable_previous"><a href="#" aria-controls="datatable" data-dt-idx="0" tabindex="0">Next</a></li>';
    //5. Về cuối trang trang
    str +=
      '<li class="paginate_button previous disabled" id="datatable_previous"><a href="#" aria-controls="datatable" data-dt-idx="0" tabindex="0">Last</a></li>';

    return str;
  }

  view_network() {
    return ` <div class="row">
        <div class="col-md-12 col-sm-12 ">
          <div class="dashboard_graph">
    
            <div class="row x_title">
              <div class="col-md-6">
                <h3>Network Activities <small>Graph title sub-title</small></h3>
              </div>
              <div class="col-md-6">
                <div id="reportrange" class="pull-right" style="background: #fff; cursor: pointer; padding: 5px 10px; border: 1px solid #ccc">
                  <i class="glyphicon glyphicon-calendar fa fa-calendar"></i>
                  <span>December 30, 2014 - January 28, 2015</span> <b class="caret"></b>
                </div>
              </div>
            </div>
    
            <div class="col-md-9 col-sm-9 ">
              <div id="chart_plot_01" class="demo-placeholder"></div>
            </div>
            <div class="col-md-3 col-sm-3  bg-white">
              <div class="x_title">
                <h2>Top Campaign Performance</h2>
                <div class="clearfix"></div>
              </div>
    
              <div class="col-md-12 col-sm-12 ">
                <div>
                  <p>Facebook Campaign</p>
                  <div class="">
                    <div class="progress progress_sm" style="width: 76%;">
                      <div class="progress-bar bg-green" role="progressbar" data-transitiongoal="80"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <p>Twitter Campaign</p>
                  <div class="">
                    <div class="progress progress_sm" style="width: 76%;">
                      <div class="progress-bar bg-green" role="progressbar" data-transitiongoal="60"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-md-12 col-sm-12 ">
                <div>
                  <p>Conventional Media</p>
                  <div class="">
                    <div class="progress progress_sm" style="width: 76%;">
                      <div class="progress-bar bg-green" role="progressbar" data-transitiongoal="40"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <p>Bill boards</p>
                  <div class="">
                    <div class="progress progress_sm" style="width: 76%;">
                      <div class="progress-bar bg-green" role="progressbar" data-transitiongoal="50"></div>
                    </div>
                  </div>
                </div>
              </div>
    
            </div>
    
            <div class="clearfix"></div>
          </div>
        </div>
    
      </div>
      <br />`;
  }

  view_report() {
    return ` <div class="row" style="display: inline-block;" >
        <div class="tile_count">
          <div class="col-md-2 col-sm-4  tile_stats_count">
            <span class="count_top"><i class="fa fa-user"></i> Total Users</span>
            <div class="count">2500</div>
            <span class="count_bottom"><i class="green">4% </i> From last Week</span>
          </div>
          <div class="col-md-2 col-sm-4  tile_stats_count">
            <span class="count_top"><i class="fa fa-clock-o"></i> Average Time</span>
            <div class="count">123.50</div>
            <span class="count_bottom"><i class="green"><i class="fa fa-sort-asc"></i>3% </i> From last Week</span>
          </div>
          <div class="col-md-2 col-sm-4  tile_stats_count">
            <span class="count_top"><i class="fa fa-user"></i> Total Males</span>
            <div class="count green">2,500</div>
            <span class="count_bottom"><i class="green"><i class="fa fa-sort-asc"></i>34% </i> From last Week</span>
          </div>
          <div class="col-md-2 col-sm-4  tile_stats_count">
            <span class="count_top"><i class="fa fa-user"></i> Total Females</span>
            <div class="count">4,567</div>
            <span class="count_bottom"><i class="red"><i class="fa fa-sort-desc"></i>12% </i> From last Week</span>
          </div>
          <div class="col-md-2 col-sm-4  tile_stats_count">
            <span class="count_top"><i class="fa fa-user"></i> Total Collections</span>
            <div class="count">2,315</div>
            <span class="count_bottom"><i class="green"><i class="fa fa-sort-asc"></i>34% </i> From last Week</span>
          </div>
          <div class="col-md-2 col-sm-4  tile_stats_count">
            <span class="count_top"><i class="fa fa-user"></i> Total Connections</span>
            <div class="count">7,325</div>
            <span class="count_bottom"><i class="green"><i class="fa fa-sort-asc"></i>34% </i> From last Week</span>
          </div>
        </div>
      </div>`;
  }

  view_input() {
    var str = ``;

    str += `<div class="item form-group">`;
    str += `<label class="col-form-label col-md-3 col-sm-3 label-align" for="first-name">
        First Name <span class="required">*</span>
      </label>`;
    str += `<div class="col-md-6 col-sm-6 ">
        <input type="text" id="first-name" required="required" class="form-control ">
      </div>`;
    str += `</div>`;
    return str;
  }

  get_view_input(type = "text", name = "", required = true, event = false) {
    var str_required = required == true ? 'required = "required"' : "";

    var str_event =
      event == true
        ? 'onchange="ChangeToSlug(' +
        "'" +
        name +
        "'" +
        "," +
        "'slug'" +
        ')" onkeyup ="ChangeToSlug(' +
        "'" +
        name +
        "'" +
        "," +
        "'slug'" +
        ')"  onkeydown="ChangeToSlug(' +
        "'" +
        name +
        "'" +
        "," +
        "'slug'" +
        ')" '
        : "";

    var str =
      `<input type="` +
      type +
      `" id="` +
      name +
      `"` +
      str_required +
      " " +
      str_event +
      ` class="form-control ">`;

    str += '<span class="error error_' + name + '"></span>';

    return str;
  }

  get_view_textArea(name = "", rows = 3) {
    return (
      `<textarea row = "` +
      rows +
      `" id="` +
      name +
      `" class="form-control "></textarea>`
    );
  }

  get_view_select(array = [], name = "", required = true) {
    var str_required = required == true ? 'required = "required"' : "";

    var str =
      `<select id="` + name + `"` + str_required + ` class="form-control ">`;

    str += `<option value="0">--Chọn--</option>`;

    if (array) {
      array.forEach((e) => {
        str += `<option value="` + e.value + `">` + e.name + `</option>`;
      });
    }

    str += `</select>`;

    str += '<span class="error error_' + name + '"></span>';

    return str;
  }

  view_form_edit(array = []) {
    var str_required = ``;

    var str =
      `<div class="row"><div class="x_panel">
      <div class="x_title">
        <h2>` +
      this.name_module(this.get_url(2)) +
      `<small>Thêm dữ liệu</small></h2>
        <ul class="nav navbar-right panel_toolbox">
          <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
          </li>
          <li><a class="close-link"><i class="fa fa-close"></i></a>
          </li>
        </ul>
        <div class="clearfix"></div>
      </div>
      <div class="x_content">
        <br>
        <form id="submitForm" >`;

    array.forEach((e) => {
      str += `<div class="item form-group">
            <label class="col-form-label col-md-3 col-sm-3 label-align" for="first-name">`;

      str_required =
        e.required == true
          ? '<span class="required" style="color:red">(*)</span>'
          : "";

      str += this.name_property(e.name) + str_required;

      str += `</label><div class="col-md-6 col-sm-6 ">`;

      //Xét kiểu element

      if (e.element == "input") {
        str += this.get_view_input(e.type, e.name, e.require, e.event);
      } else if (e.element == "select") {
        str += this.get_view_select(e.array, e.name, e.require);
      } else if (e.element == "textarea") {
        str += this.get_view_textArea(e.name, e.rows);
      }
      str += `</div>
            </div>`;
    });

    str +=
      `<div class="ln_solid"></div>
          <div class="item form-group">
            <div class="col-md-6 col-sm-6 offset-md-3">

              <button type="submit" class="btn btn-primary">Lưu lại</button>
              <a href="/admin/` + this.get_url() + `/index" class="btn btn-danger">Thoát</a>
                            
            </div>
          </div>

        </form>
      </div>
    </div></div>`;

    return str;
  }

  view_form(array = []) {
    var str_required = ``;

    var str =
      `<div class="row"><div class="x_panel">
      <div class="x_title">
        <h2>` +
      this.name_module(this.get_url(2)) +
      `<small>Thêm dữ liệu</small></h2>
        <ul class="nav navbar-right panel_toolbox">
          <li><a class="collapse-link"><i class="fa fa-chevron-up"></i></a>
          </li>
          <li><a class="close-link"><i class="fa fa-close"></i></a>
          </li>
        </ul>
        <div class="clearfix"></div>
      </div>
      <div class="x_content">
        <br>
        <form id="submitForm" >`;

    array.forEach((e) => {
      str += `<div class="item form-group">
            <label class="col-form-label col-md-3 col-sm-3 label-align" for="first-name">`;

      str_required =
        e.required == true
          ? '<span class="required" style="color:red">(*)</span>'
          : "";

      str += this.name_property(e.name) + str_required;

      str += `</label><div class="col-md-6 col-sm-6 ">`;

      //Xét kiểu element

      if (e.element == "input") {
        str += this.get_view_input(e.type, e.name, e.require, e.event);
      } else if (e.element == "select") {
        str += this.get_view_select(e.array, e.name, e.require);
      } else if (e.element == "textarea") {
        str += this.get_view_textArea(e.name, e.rows);
      }
      str += `</div>
            </div>`;
    });

    str +=
      `<div class="ln_solid"></div>
          <div class="item form-group">
            <div class="col-md-6 col-sm-6 offset-md-3">

              <button type="submit" class="btn btn-primary">Lưu lại</button>
              <a href="/admin/` + this.get_url() + `/index" class="btn btn-danger">Thoát</a>
                            
            </div>
          </div>

        </form>
      </div>
    </div></div>`;

    return str;
  }

  ChangeToSlug(title ='')
  {
    var  slug;

    //Đổi chữ hoa thành chữ thường
    slug = title.toLowerCase();
 
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
  dequy(array =[], id= '') 
  {
    var json = [];
    array.forEach(e =>{
      if(e.parents == id){
        json.push({
          name: e.name,
          slug: e.slug,
          childs: this.dequy(array, e.name)
        })
      }
    });
    return json;
  }
}

module.exports = Admin;
