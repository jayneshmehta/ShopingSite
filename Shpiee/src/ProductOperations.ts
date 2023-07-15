// import { product } from './addata';

import { products } from "./addata";

class ProductOperations {

    //listing of all product's
    public productlisting(productdata: object[], pageNo: any): void {

        var totallength = productdata.length;
        pageNo = (isNaN(pageNo)) ? 1 : pageNo;
        var numberofelements = 12;
        let firstelement = (pageNo - 1) * numberofelements
        let lastelement = (pageNo) * numberofelements
        var totalPages = Math.ceil(totallength / numberofelements);

        let next: number;

        let Previous: number;
        (pageNo == 1) ? Previous = 1 : Previous = pageNo - 1;
        (pageNo == totalPages) ? next = totalPages : next = pageNo + 1;

        $('#mainbody').html('');
        $("#pagination").html('');
        (totalPages > 1)
            ? $("#pagination").append(`
            <li class="page-item">
                <a class="page-link paginate previous" id='page_${Previous}' aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
             </li>`)
            : '';

        var i = 1
        while (i <= totalPages) {
            var addclass: string = (pageNo == i) ? 'text-danger' : '';
            $("#pagination").append(`
                <li class="page-item"><a class="page-link ${addclass} paginate" id='page_${i}'>${i}</a></li>
            `);
            i++;
        }
        (totalPages > 1) ?
            $("#pagination").append(`
            <li class="page-item">
            <a class="page-link paginate next" id='page_${next}' aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
            </a>
            </li>
        `) : "";

        ($('#sort').val() == 'A2Z') ? productdata.sort((a: any, b: any) => a.title.localeCompare(b.title))
            : ($('#sort').val() == 'Z2A') ? (productdata.sort((a: any, b: any) => a.title.localeCompare(b.title)), productdata.reverse())
                : ($('#sort').val() == 'L2H') ? productdata.sort((a: any, b: any) => parseFloat(a.price) - parseFloat(b.price)) :
                    ($('#sort').val() == 'H2L') ? productdata.sort((a: any, b: any) => parseFloat(b.price) - parseFloat(a.price)) :
                        productdata = productdata.slice(firstelement, lastelement);
        (productdata.length == 0) ?
            $('#mainbody').html(`
            <div class='row text-danger justify-content-center fs-5'>Sorry, No data Found :( </div>
            `) :
            productdata.forEach((element: object, i: number) => {
                element['quantity'] = 0;
                $('#mainbody').append(this.addhtml(element, i));
            });
    }
    
    /* 
    add html to all product listing
    @return string
    */
    public addhtml(element: products, i: number): string {
        let discountedprice = element.price - element.price * element.discountPercentage / 100
        return `<div class="card  parentscale shadow" style="width: 18rem;" >
        <img src="${element.thumbnail}" height='300px' class="scale card-img-top p-4 " alt="productimg">
        <div class="card-body border-top border-2">
        <h5 class="card-title text-truncate"  >${element.title.charAt(0).toUpperCase() + element.title.slice(1)}</h5>
        <p class="card-text"><strong>Price : <span class='text-danger'><s>${element.price}</s></span><span class='ms-2  '>${discountedprice}</span></strong></p>
        <p class="card-text"><strong>Discount : </strong><span class='text-danger'>${element.discountPercentage}</span>%</p>
        <div class='' style=' overflow: hidden; min-height: 75px; display: -webkit-box;-webkit-line-clamp: 3; -webkit-box-orient: vertical; '>
        <p class="card-text "><strong>Description : </strong></strong>${element.description}</p>
        </div>
        <div class='row gx-0'>  
        <a href="#" class="btn btn mt-2 viewProduct" id='card_${element.id}' style='background-color:#ff5252; border-color:#ff5252;color:#fce4ec'>View Product</a>
        </div>
        </div>
        </div>`;
    }

    //searching the product
    public searching<type0, type1, type2>(product: type0, searchval: type1, categorysearch: type2): void {
        let searchProductList = product.filter((element: object) => ((element.title.toLowerCase().includes(searchval) || element.brand.toLowerCase().includes(searchval)) && element.category.toLowerCase().includes(categorysearch)));
        this.productlisting(searchProductList, 1);
    }

}

// export the ProductOperations class 
export { ProductOperations as PO };