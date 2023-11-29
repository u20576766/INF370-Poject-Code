import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Book, Books } from '../shared/books';
import { Router } from '@angular/router';
import { ShoppingCartBook } from '../shared/shoppingcart';
import { ShoppingCart } from '../shared/shoppingcart';
import { DataService } from '../services/data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { Module } from '../shared/module';
import { Faculty } from '../shared/faculty';
import { Department } from '../shared/department';
import { Tree } from '../shared/Tree'


@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {

  //bookfiltered
  filteredBooks: Book[] = [];
  faculty_ID: number = 0;
  dep_ID: number = 0;
  mod_ID: string = "";
  //cart: number = 0;

  studentID = localStorage.getItem('studentId');
  sID = parseInt(this.studentID ?? '0', 10);

  bookList: Book[] = []
  filteredBooksByModule: Book[] = [];
  modulelist: Module[] = []
  facultylist: any[] = []
  departmentlist: Department[] = []
  cart: ShoppingCart[] = []
  shoppingCart: ShoppingCart | null = null;

  // Trail text properties
  facultyName: string = '';
  departmentName: string = '';
  moduleCode: string = '';
  trailText: string = '';

  constructor(private data: DataService, private router: Router, private snackbar: MatSnackBar) { }

  ngOnInit(): void {
    console.log(this.sID)
    console.log("tree", this.data);
    this.GetAllBooks();
    this.getFaculties();
    console.log(this.trailText)
  }

  //Get All Book
  GetAllBooks() {
    this.data.GetBooks().subscribe(
      (result: Books) => {
        this.bookList = result.$values.sort((a, b) => a.title.localeCompare(b.title)); // Sort by title alphabetically
      },
      (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was a server error loading the books',
        });
      }
    );
  }

  onModuleChange() {
    // Reset department and module selections
    localStorage.setItem('modID', this.mod_ID.toString()); // Convert to string before storing
    console.log(this.mod_ID); // Check if selectedFacultyId is correct

    // Reset bookList before applying filters
    this.bookList = [];

    // Get faculty ID from localStorage
    const storedFacID = localStorage.getItem('facID');
    const facID = storedFacID ? parseInt(storedFacID, 10) : 0;

    // Get department ID from localStorage
    const storedDeptID = localStorage.getItem('deptID');
    const deptID = storedDeptID ? parseInt(storedDeptID, 10) : 0;

    // Get module ID from localStorage
    const storedModID = localStorage.getItem('modID');
    const modID = storedModID;

    if (facID !== 0) {
      // Get departments with faculty ID equal to selected faculty ID
      this.data.GetAllDepartments().subscribe(
        (departments: Department[]) => {
          const filteredDepartments = departments.filter(department => department.faculty_ID === facID);

          if (filteredDepartments.length > 0 && deptID !== 0) {
            // Get modules with department ID equal to retrieved department ID
            this.data.GetAllModules().subscribe(
              (modules: Module[]) => {
                const filteredModules = modules.filter(module => module.department_ID === deptID);

                if (filteredModules.length > 0 && modID !== "") {
                  console.log('modID:', modID); // Debug log to check the value of modID

                  // Get books with module ID equal to retrieved module ID
                  this.data.GetBooks().subscribe(
                    (result: Books) => {
                      this.bookList = result.$values.filter(b => b.module_Code == modID);
                      if (this.bookList.length === 0) {
                        Swal.fire({
                          icon: 'info',
                          title: 'No Books Found',
                          text: 'There are no books available for the selected module',
                        });
                      }
                      console.log('Filtered Books:', this.bookList);
                    },
                    (error: any) => {
                      console.error('Error fetching books:', error);
                    }
                  );
                }
              },
              (error: any) => {
                console.error('Error fetching modules:', error);
              }
            );
          }
        },
        (error: any) => {
          console.error('Error fetching departments:', error);
        }
      );
    } else {
      // If no faculty is selected, show all books
      this.data.GetBooks().subscribe(
        (books: Books) => {
          this.bookList = books.$values;
          console.log('All Books:', this.bookList);
        },
        (error: any) => {
          console.error('Error fetching books:', error);
        }
      );
    }
    this.updateTrailText()
  }


  getFaculties(): void {
    this.data.GetAllFaculties().subscribe(
      (data) => {
        this.facultylist = data;
      },
      (error) => {
        console.error('Error fetching faculties:', error);
      }
    );
  }

  isIconFlipped: boolean = false;
  flipIcon() {
    this.isIconFlipped = !this.isIconFlipped;
  }

  onFacultyChange() {
    // Reset department and module selections
    localStorage.setItem('facID', this.faculty_ID.toString());

    this.facultyName = '';

    // Get faculty ID from localStorage
    const storedFacID = localStorage.getItem('facID');
    const facID = storedFacID ? parseInt(storedFacID, 10) : 0;

    // Get department ID from localStorage
    const storedDeptID = localStorage.getItem('deptID');
    const deptID = storedDeptID ? parseInt(storedDeptID, 10) : 0;

    // Get module ID from localStorage
    const storedModID = localStorage.getItem('modID');
    const modID = storedModID;

    // Get departments with faculty ID equal to selected faculty ID
    this.data.GetAllDepartments().subscribe(
      (departments: Department[]) => {
        const filteredDepartments = departments.filter(department => department.faculty_ID === facID);

        if (filteredDepartments.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'No Departments Found',
            text: 'There are no departments found for the selected faculty',
          });
          return; // No need to proceed further if there are no departments
        }

        // Get department IDs to filter modules
        const departmentIDs = filteredDepartments.map(department => department.department_ID);
        console.log(departmentIDs);

        // Get modules with department IDs equal to retrieved department IDs
        this.data.GetAllModules().subscribe(
          (modules: Module[]) => {
            const filteredModules = modules.filter(module => departmentIDs.includes(module.department_ID));

            if (filteredModules.length === 0) {
              Swal.fire({
                icon: 'info',
                title: 'No Modules Found',
                text: 'There are no modules available for the selected departments',
              });
              return; // No need to proceed further if there are no modules
            }

            // Create an empty array to store books
            this.bookList = [];

            // Iterate through filtered modules and get books with the same module ID
            filteredModules.forEach(module => {
              this.data.GetBooks().subscribe(
                (result: Books) => {
                  const moduleBooks = result.$values.filter(b => b.module_Code === module.module_Code);
                  console.log(`Books for Module ${module.module_ID}:`, moduleBooks);

                  // Replace the existing books in this.bookList with moduleBooks
                  this.bookList = [...this.bookList, ...moduleBooks];

                  // Check if this is the last module, then display the bookList
                  if (module === filteredModules[filteredModules.length - 1]) {
                    console.log('Final Book List:', this.bookList);
                    if (this.bookList.length === 0) {
                      Swal.fire({
                        icon: 'info',
                        title: 'No Books Found',
                        text: 'There are no books available for the selected faculty',
                      });
                    }
                  }

                },
                (error: any) => {
                  console.error('Error fetching books:', error);
                }
              );
            });
          },
          (error: any) => {
            console.error('Error fetching modules:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error fetching departments:', error);
      }
    );
    this.getDepartments();
    this.updateTrailText()
    console.log(this.trailText)
  }


  getDepartments(): void {
    // Get departments from the API
    const storedFacID = localStorage.getItem('facID');
    const facID = storedFacID ? parseInt(storedFacID, 10) : 0; // Parse string to number

    this.data.GetAllDepartments().subscribe(
      (data) => {
        this.departmentlist = data.filter((department: any) => department.faculty_ID === facID);
        console.log('Filtered depa:', this.departmentlist);
      },
      (error) => {
        console.error('Error fetching departments:', error);
      }
    );
  }

  onDepartmentChange() {
    localStorage.setItem('deptID', this.dep_ID.toString());

    // Get department ID from localStorage
    const storedDeptID = localStorage.getItem('deptID');
    const deptID = storedDeptID ? parseInt(storedDeptID, 10) : 0;

    // Get module ID from localStorage
    const storedModID = localStorage.getItem('modID');
    const modID = storedModID;



    if (deptID !== 0) {
      // Get modules with department ID equal to the retrieved department ID
      this.data.GetAllModules().subscribe(
        (modules: Module[]) => {
          const filteredModules = modules.filter(module => module.department_ID === deptID);
          if (filteredModules.length === 0) {
            Swal.fire({
              icon: 'info',
              title: 'No Modules Found',
              text: 'There are no modules available for the selected departments',
            });
            return; // No need to proceed further if there are no modules
          }

          if (filteredModules.length > 0) {
            // Create an empty array to store books
            let tempBookList: Book[] = [];

            // Iterate through filtered modules and get books with the specified module IDs
            filteredModules.forEach(module => {
              this.data.GetBooks().subscribe(
                (result: Books) => {
                  const moduleBooks = result.$values.filter(b => b.module_Code === module.module_Code);
                  console.log(`Books for Module ${module.module_Code}:`, moduleBooks);

                  // Add moduleBooks to tempBookList
                  tempBookList = [...tempBookList, ...moduleBooks];

                  // Check if this is the last module, then assign tempBookList to this.bookList
                  if (module === filteredModules[filteredModules.length - 1]) {
                    this.bookList = tempBookList;

                    // Check if no books are found and show SweetAlert
                    if (this.bookList.length === 0) {
                      Swal.fire({
                        icon: 'info',
                        title: 'No Books Found',
                        text: 'There are no books available for the selected department',
                      });
                    }

                    console.log('Final Book List:', this.bookList);
                  }
                },
                (error: any) => {
                  console.error('Error fetching books:', error);
                }
              );
            });
          }
        },
        (error: any) => {
          console.error('Error fetching modules:', error);
        }
      );
    }
    this.getModules(); // Update modules based on the selected department
    this.updateTrailText()
    console.log(this.trailText)
    this.natHouse()
  }

  getModules(): void {
    // Get modules from the API
    const storedDeptID = localStorage.getItem('deptID');
    const deptID = storedDeptID ? parseInt(storedDeptID, 10) : 0;

    this.data.GetAllModules().subscribe(
      (data) => {
        // Filter modules based on the selected department ID
        this.modulelist = data.filter((module: Module) => module.department_ID === deptID);
        console.log('Filtered modules:', this.modulelist);
      },
      (error) => {
        console.error('Error fetching modules:', error);
      }
    );
  }

  clearDropdowns(): void {
    localStorage.removeItem('facID');
    localStorage.removeItem('deptID');
    localStorage.removeItem('modID');
    location.reload();
    this.GetAllBooks();

  }

  AddToCart(book_ID: number) {
    const selectedBook = this.bookList.find(book => book.book_ID === book_ID);
    console.log(selectedBook)
    console.log(book_ID)
    console.log(this.sID)

    if (selectedBook) {
      let bcart = new ShoppingCartBook();
      bcart.book_ID = selectedBook.book_ID;

      // Calculate the total price based on the book's price from the bookList
      const totalPrice = selectedBook.price * bcart.quantity;
      console.log(selectedBook.price);
      console.log(selectedBook)

      // Set other properties of bcart if needed

      this.data.AddBookToCart(this.sID, bcart).subscribe(
        (response: any) => {
          this.data.getShoppingCart(this.sID);
          this.snackbar.open('Book Added To Cart Successfully', 'OK', {
            duration: 3000,
            verticalPosition: 'top'
          });
        },
        (error: any) => {
          console.error('Error adding book to cart:', error);
          // Show error SweetAler
          Swal.fire({
            icon: 'error',
            title: 'Server Error',
            text: 'Failed to add book to cart',
            timer: 1500
          });
        }
      );
    } else {
      console.error('Book not found in bookList');
      // Handle the case where the book is not found in the bookList
    }
  }


  ViewBookItem(bid: number) {
    const selectedBook = this.bookList.find(b => b.book_ID === bid);

    console.log(selectedBook)
    this.router.navigate(['/BookItem', bid])

  }

  updateTrailText() {
    // Get faculty ID from localStorage
    const storedFacID = localStorage.getItem('facID');
    const facID = storedFacID ? parseInt(storedFacID, 10) : 0;

    // Get department ID from localStorage
    const storedDeptID = localStorage.getItem('deptID');
    const deptID = storedDeptID ? parseInt(storedDeptID, 10) : 0;

    // Get module ID from localStorage
    const storedModID = localStorage.getItem('modID');
    const modID = storedModID;

    const facultyName = this.facultylist.find(f => f.faculty_ID === facID)?.faculty_Name;
    const departmentName = this.departmentlist.find(d => d.department_ID === deptID)?.department_Name;
    const moduleCode = this.modulelist.find(m => m.module_Code === modID)?.module_Code;

    // Construct trail text based on available values, hide items if they are undefined or null
    this.trailText = ` | ${facultyName ? `Faculty: ${facultyName} |` : ''} ${departmentName ? `Department: ${departmentName} |` : ''} ${moduleCode ? `Module Code: ${moduleCode}` : ''}`;
  }

  hintButton() {
    Swal.fire({
      title: 'Book Filter Tutorial',
      html: `
      <style>
                /* CSS for zooming images */
                .zoomable-image {
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                .zoomable-image:hover {
                    transform: scale(1.2);
                }
            </style>
      <div class="container" style="text-align:center;height:fit-content;">
        <p>To Filter Books By Faculty, Department and Module: </p><br>
        <div style="marging:20px" >
          <div class="row" style="marging:10px">
            <p>1. Select a faculty, then wait for the books to display. You can see your directory at the top.</p>
          </div>
          <div class="row" style="marging:10px">
            <div class="col">
              <a href="../assets/Book Filter/Screenshot (206).png" target="_blank" data-lightbox="images" data-title="Step 1">
                <img src="../assets/Book Filter/Screenshot (206).png" class="zoomable-image" style="width: 70%; height: auto;">
              </a>
            </div>
            <div class="col">
              <a href="../assets/Book Filter/Screenshot (207).png" target="_blank" data-lightbox="images" data-title="Step 1">
                <img src="../assets/Book Filter/Screenshot (207).png" class="zoomable-image" style="width: 70%; height: auto;">
              </a>
            </div> 
          </div>
        </div>

        <div style="marging:20px" >
          <div class="row" style="marging:10px">
            <p>2. Select a department from that faculty, then wait for the books to display. You can see your directory at the top.</p>
          </div>
          <div class="row" style="marging:10px">
            <div class="col">
              <a href="../assets/Book Filter/Screenshot (208).png" target="_blank" data-lightbox="images" data-title="Step 1">
                <img src="../assets/Book Filter/Screenshot (208).png" class="zoomable-image" style="width: 70%; height: auto;">
              </a>
            </div>
            <div class="col">
              <a href="../assets/Book Filter/Screenshot (209).png" target="_blank" data-lightbox="images" data-title="Step 1">
                <img src="../assets/Book Filter/Screenshot (209).png" class="zoomable-image" style="width: 70%; height: auto;">
              </a>
            </div> 
          </div>
        </div>

        <div  style="marging:20px" >
          <div class="row" style="marging:10px" >
            <p>3. Select a module from that department, then wait for the books to display. You can see your directory at the top.</p>
          </div>
          <div class="row" style="marging:10px">
            <div class="col">
              <a href="../assets/Book Filter/Screenshot (210).png" target="_blank" data-lightbox="images" data-title="Step 1">
                <img src="../assets/Book Filter/Screenshot (210).png" class="zoomable-image" style="width: 70%; height: auto;">
              </a>
            </div>
            <div class="col">
              <a href="../assets/Book Filter/Screenshot (211).png" target="_blank" data-lightbox="images" data-title="Step 1">
                <img src="../assets/Book Filter/Screenshot (211).png" class="zoomable-image" style="width: 70%; height: auto;">
              </a>
            </div> 
          </div>
        </div>
      </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      width: 'auto',
      customClass: {
        container: 'zoomable-container'
      }
    });
  }


  natHouse() {
    const storedDeptID = localStorage.getItem('deptID');
    const deptID = storedDeptID ? parseInt(storedDeptID, 10) : 0;
  
    const departName = this.departmentlist.find(d => d.department_ID === deptID)?.department_Name;
    console.log(departName);
  
    if (departName && departName.toLowerCase().includes("chemistry")) {
      Swal.fire({
        html: `
        <div style="padding: 15px; margin: 20px; text-align: center;align-items: center;">
        <div 
            style="background-color: #4f274994; color: white; text-align: center;padding: 20px;border-radius: 10px;">
            <h2 style="margin: 10px;color:#4F274A;font-weight:bold;"><i class="fa fa-lightbulb" style="color:yellow;" aria-hidden="true"></i>  Hint</h2>
            <img src="../assets/suggest.png" style="width: 40%; height: auto;padding:10px"><br>
            <div >
                <p style="margin: 10px;color:#4F274A;">
                    Some NAT House Chemistry Modules Require Lab Equipment. <br>
                    Check out our Equipments page to look at items <br>that might be required by your modules.
                </p>
            </div>
        </div>
    </div>
        `,
        showCloseButton: true,
        showCancelButton: true,
        confirmButtonColor: '#4F274A',
        cancelButtonColor: 'black',
        confirmButtonText: `LET'S GO!`,
        cancelButtonText: 'NOTED',
        width: 'auto',
        customClass: {
          container: 'zoomable-container'
        }
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/Equipment']);
        }
      });
    }
  }
  

}
