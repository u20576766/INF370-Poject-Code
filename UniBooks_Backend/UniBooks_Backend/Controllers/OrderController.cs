using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.Models;
using UniBooks_Backend.ViewModels;
using UniBooks_Backend.Controllers;
using System.Diagnostics.CodeAnalysis;
using System.Reflection.Metadata.Ecma335;
using UniBooks_Backend.Interface_Repoistory;
using UniBooks_Backend.Model;
using MimeKit;
using MailKit.Net.Smtp;
using UniBooks.ViewModels;
using UniBooks_Backend.Repository;
using UniBooks_Backend.Interface_Repository;
using MimeKit;
using UniBooks_Backend.InterfaceRepositories;

namespace UniBooks.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository _OrderRepository;
        private readonly AppDbContext _appDbContext;
        private readonly IVoucherRepository _voucherRepository;
        private readonly IShoppingCartRepository _spRepository;
        private readonly IStudentRepository _studentRepository;
        private readonly IShoppingCart_BookRepository _shoppingCart_BookRepository;
        private readonly IBook_InventoryRepository _inventoryRepository;
        private readonly IEquipmentRepository _equipmentRepository;
        private readonly IOrderStatusRepository _orderStatusRepository;

        public OrderController(IOrderRepository OrderRepository, IVoucherRepository voucherRepository, AppDbContext appDbContext, IShoppingCartRepository spRepository, IStudentRepository student, IShoppingCart_BookRepository shoppingCart_BookRepository, IBook_InventoryRepository inventoryRepository, IEquipmentRepository equipmentRepository, IOrderStatusRepository orderStatusRepository)
        {
            _OrderRepository = OrderRepository;
            _voucherRepository = voucherRepository;
            _appDbContext = appDbContext;
            _spRepository = spRepository;
            _studentRepository = student;
            _shoppingCart_BookRepository = shoppingCart_BookRepository;
            _inventoryRepository = inventoryRepository;
            _equipmentRepository = equipmentRepository;
            _orderStatusRepository = orderStatusRepository;
        }


        [HttpGet]
        [Route("GetAllExistingOrders")]
        public async Task<IActionResult> GetAllExistingOrders()
        {
            var results = await _OrderRepository.GetAllExistingOrdersAsync();

            if (results == null || results.Length == 0)
            {
                return NotFound();
            }

            return Ok(results);
        }

        [HttpGet]
        [Route("GetOrderByStatus/{statusid}")]
        public async Task<IActionResult> GetOrderByStatus(int statusid)
        {

            try
            {
                var orders = await _OrderRepository.GetOrderByStatus(statusid);
                if (orders != null)
                {
                    return Ok(orders);
                }

                return NotFound("No Orders with that status were found ");
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
        }


        [HttpGet]
        [Route("GetAllOrderLine")]
        public async Task<IActionResult> GetAllOrderLine()
        {
            try
            {
                var results = await _OrderRepository.GetAllOrderLineAsync();
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }

        }

        [HttpGet]
        [Route("GetOrderLines/{orderid}")]
        public async Task<IActionResult> GetOrderLinesById(int orderid)
        {
            try
            {
                var results = await _OrderRepository.GetOrderLineSByIdAsync(orderid);
                return Ok(results);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }

        }


        [HttpGet]
        [Route("GetOrderInput/{referenceNumber}")]
        public async Task<IActionResult> GetOrderInputAsync(string referenceNumber)
        {
            try
            {
                var answer = await _OrderRepository.GetOrderByInputAsync(referenceNumber);
                if (answer == null) return NotFound("Order does not exist");

                return Ok(answer);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpGet]
        [Route("GetOrder/{orderid}")]
        public async Task<IActionResult> GetOrderAsync(int orderid)
        {
            try
            {
                var answer = await _OrderRepository.GetOrderByIdAsync(orderid);

                if (answer == null) return NotFound("Order does not exist");

                return Ok(answer);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }

        [HttpGet]
        [Route("GetOrderLine/{studentid}")]
        public async Task<IActionResult> GetAllOrderLineByIdAsync(int studentid)
        {
            try
            {
                var answer = await _OrderRepository.GetAllOrderLineByIdAsync(studentid);
                if (answer == null) return NotFound("Order Line does not exist");

                return Ok(answer);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support");
            }
        }



        [HttpPut]
        [Route("ProcessOrder/{refNo}/{statusid}")]
        public async Task<ActionResult> ProcessOrder(string refNo, int statusid)
        {
            try
            {
                var existingOrder = await _OrderRepository.GetOrderByRefAsync(refNo);
                if (existingOrder == null) return NotFound($"The Order does not exist");
                var student = await _studentRepository.GetAStudentAsync(existingOrder.Student_ID);

                existingOrder.Order_Status_ID = statusid;

                if (await _OrderRepository.SaveChangesAsync())
                {
                    // Create a new email message

                    var message = new MimeMessage();
                    message.From.Add(new MailboxAddress("The Book Market", "unibooks.thebookmarket@gmail.com"));
                    message.To.Add(new MailboxAddress(student.Name, student.Email));
                    message.Subject = "Ready For Collection: #" + existingOrder.Order_Reference_Number;

                    // Create the email body
                    var bodyBuilder = new BodyBuilder();
                    bodyBuilder.TextBody = "Hello " + student.Name + " " + student.Surname + "!\n" +
                        "\n" + "Your Order is ready for collection. All you need is the Order Reference which is connected to the email!" +
                         "\n" + "Come and collect it at our address. Even better ask a friend to collect for you!" +
                        "\n" + "\n" + "Kind Regards," +
                        "\n" + "The Book Market" +
                        "\n" + "+27 76 657 6806" +
                        "\n" + "info@thebookmarket.co.za" +
                        "\n" + "1105 Prospect Street, Hatfield, Pretoria";

                    message.Body = bodyBuilder.ToMessageBody();

                    // Send the email
                    using (var client = new SmtpClient())
                    {

                        client.Connect("smtp.gmail.com", 587, false);
                        client.Authenticate("unibooks.thebookmarket@gmail.com", "nzrtvdxrsdpleubc");

                        // Send the email
                        await client.SendAsync(message);

                        // Disconnect from the SMTP server
                        client.Disconnect(true);
                    }

                    return Ok(existingOrder);
                }

                return StatusCode(500, "Failed to save changes to the order.");
            }
            catch (Exception ex)
            {
                // Log the exception for debugging purposes
                Console.WriteLine($"An error occurred: {ex}");
                return StatusCode(500, "An error occurred while processing the request.");
            }
        }

        [HttpPost]
        [Route("CreateOrderLinesFromCart/{studentid}")]
        public async Task<IActionResult> CreateOrderLinesFromCart(int studentid)
        {
            try
            {
                var existingOrders = await _OrderRepository.GetOrderWithNoOrderLinesAsync(studentid);

                if (existingOrders != null && existingOrders.Count() > 0)
                {
                    var existingOrder = existingOrders[0];
                    var books = await _spRepository.GetCartBookAsync(studentid);
                    var shoppingCart = await _spRepository.GetShoppingCartByStudentIdAsync(studentid);
                    var equipment = await _spRepository.GetCartEquipmentAsync(studentid);
                    var student = await _studentRepository.GetAStudentAsync(studentid);

                    foreach (var cartItem in equipment)
                    {
                        var newOrderLine = new Order_Line
                        {
                            Order_ID = existingOrder.Order_ID,
                            Equipment_ID = cartItem.Equipment_ID,
                            Book_ID = null,
                            ItemName = cartItem.Name,
                            Price = cartItem.Price,
                            Quantity = cartItem.Quantity,
                            Equipment = null
                        };

                        _OrderRepository.Add(newOrderLine);
                        var eq = await _equipmentRepository.GetEquipmentByIDAsync(cartItem.Equipment_ID);
                        if (eq != null)
                        {
                            eq.Quantity_On_Hand -= cartItem.Quantity;
                        }
                    }

                    foreach (var cartItemE in books)
                    {
                        var newOrderLine = new Order_Line
                        {
                            Order_ID = existingOrder.Order_ID,
                            Equipment_ID = null,
                            Book_ID = cartItemE.Book_ID,
                            ItemName = cartItemE.Title,
                            Price = cartItemE.Price,
                            Quantity = cartItemE.Quantity,
                            Book_Inventory = null
                        };

                        _OrderRepository.Add(newOrderLine);
                        var book = await _inventoryRepository.GetBookByIdAsync(cartItemE.Book_ID);
                        if (book != null)
                        {
                            book.Quantity_On_Hand -= cartItemE.Quantity;
                        }
                    }

                    _spRepository.ClearShoppingAllCarts(shoppingCart.ShoppingCart_ID);
                    shoppingCart.Discount = 0;
                    await _appDbContext.SaveChangesAsync();
                    await _OrderRepository.SaveChangesAsync();

                    // Send email and handle potential errors
                    try
                    {
                        // Create a new email message
                        var orderLines = await _OrderRepository.GetOrderLineSByIdAsync(existingOrder.Order_ID);
                        var message = new MimeMessage();
                        message.From.Add(new MailboxAddress("The Book Market", "unibooks.thebookmarket@gmail.com"));
                        message.To.Add(new MailboxAddress(student.Name, student.Email));
                        message.Subject = "Order Placed: #" + existingOrder.Order_Reference_Number;

                        // Create the email body
                        var bodyBuilder = new BodyBuilder();
                        bodyBuilder.TextBody = "Hello " + student.Name + "!" + "\n" + "\n" +
                            "Your Order has been placed. Order Details: ";

                        // Add order line items to the email body
                        foreach (var orderLine in orderLines)
                        {
                            bodyBuilder.TextBody += "\n" + "\n" +
                                "Item: " + orderLine.ItemName +
                                "\n" + "Price: R" + orderLine.Price +
                                "\n" + "Quantity: " + orderLine.Quantity +
                                "\n------------------------------------------------------------"; // Add a horizontal line
                        }

                        // Add the order total to the email body
                        bodyBuilder.TextBody += "\nOrder Total: R" + existingOrder.Order_Total + "\n" +
                            "\n" + "Kind Regards," +
                            "\n" + "The Book Market" +
                            "\n" + "+27 76 657 6806" +
                            "\n" + "info@thebookmarket.co.za" +
                            "\n" + "1105 Prospect Street, Hatfield, Pretoria";

                        message.Body = bodyBuilder.ToMessageBody();

                        // Send the email using MailKit's SmtpClient
                        using (var client = new SmtpClient())
                        {
                            client.Connect("smtp.gmail.com", 587, false);
                            client.Authenticate("unibooks.thebookmarket@gmail.com", "nzrtvdxrsdpleubc");

                            await client.SendAsync(message);
                            client.DisconnectAsync(true);
                        }

                        return Ok("Order Lines created successfully.");
                    }
                    catch (Exception emailEx)
                    {
                        // Handle email sending error
                        return Ok("Order Lines created successfully, but there was an issue sending the confirmation email.");
                    }
                }
                else
                {
                    // Handle the case where existingOrders is null or empty
                    return NotFound("No existing orders found for the student.");
                }
            }
            catch (Exception ex)
            {
                // Log the exception details for debugging purposes
                // You can also include the exception message in the response for better error reporting
                return StatusCode(500, $"An error occurred: {ex.Message}");
            }
        }





        [HttpGet]
        [Route("GetOrderByReferenceNumber/{referenceNumber}")]
        public async Task<IActionResult> GetOrderByReferenceNumber(string referenceNumber)
        {
            try
            {
                var order = await _OrderRepository.GetOrderByRefAsync(referenceNumber);

                if (order == null)
                {
                    return NotFound("Order with the given reference number does not exist.");
                }

                return Ok(order);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Internal Server Error. Please contact support.");
            }
        }




        [HttpPut]
        [Route("LogCollection/{refNo}/{collector}")]
        public async Task<IActionResult> LogCollection(string refNo, string collector)
        {
            try
            {
                var existingOrder = await _OrderRepository.GetOrderByRefAsync(refNo);
                var cartStudent = await _spRepository.GetShoppingCartByStudentIdAsync(existingOrder.Student_ID);
                var spb = await _shoppingCart_BookRepository.CalculateCartTotal(cartStudent.ShoppingCart_ID);
                var student = await _studentRepository.GetAStudentAsync(existingOrder.Student_ID);
                var collectionDate = DateTime.Now;

                var total = spb - cartStudent.Discount + (cartStudent.SubTotal - spb);

                if (existingOrder == null)
                    return NotFound($"The Order does not exist");

                if (existingOrder.Order_Status_ID != 2)
                    return BadRequest($"Cannot log collection for an order with status ID {existingOrder.Order_Status_ID}. Only orders with status ID 2 can be collected.");

                existingOrder.Order_Status_ID = 3;
                existingOrder.Collector_Name = collector;
                existingOrder.Date_Of_Collection = Convert.ToString(collectionDate);

                // Save the updated order details
                if (await _OrderRepository.SaveChangesAsync())
                {
                    // Create a new email message
                    var message = new MimeMessage();
                    message.From.Add(new MailboxAddress("The Book Market", "unibooks.thebookmarket@gmail.com"));
                    message.To.Add(new MailboxAddress(student.Name, student.Email));
                    message.Subject = "Order Collected: #" + existingOrder.Order_Reference_Number;

                    // Create the email body
                    var bodyBuilder = new BodyBuilder();
                    bodyBuilder.TextBody = "Hello " + student.Name + "!" + "\n" +
                            "\nYour Order has been Collected. Collection Details: " +
                            "\n" + "Collected By: " + existingOrder.Collector_Name +
                            "\n" + "Collected At: " + existingOrder.Date_Of_Collection + "\n" +
                            "\n" + "Kind Regards," +
                            "\n" + "The Book Market" +
                            "\n" + "+27 76 657 6806" +
                            "\n" + "info@thebookmarket.co.za" +
                            "\n" + "1105 Prospect Street, Hatfield, Pretoria";

                    message.Body = bodyBuilder.ToMessageBody();

                    // Send the email using MailKit's SmtpClient
                    using (var client = new SmtpClient())
                    {
                        client.Connect("smtp.gmail.com", 587, false);
                        client.Authenticate("unibooks.thebookmarket@gmail.com", "nzrtvdxrsdpleubc");

                        await client.SendAsync(message);
                        client.DisconnectAsync(true);
                    }
                }

                return Ok(existingOrder);
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }
        }

        [HttpDelete]
        [Route("CancelOrder/{studentid}")]
        public async Task<IActionResult> CancelOrder(int studentid)
        {
            try
            {
                var existingOrders = await _OrderRepository.GetOrderWithNoOrderLinesAsync(studentid);

                if (existingOrders != null && existingOrders.Length > 0)
                {
                    var existingOrder = existingOrders[0];

                    if (existingOrder == null) return NotFound($"The Order does not exist");

                    _OrderRepository.Delete(existingOrder);

                    if (await _OrderRepository.SaveChangesAsync()) return Ok("Order has been deleted");
                }
                else
                {
                    return NotFound("No orders found for the given student ID.");
                }
            }
            catch (Exception)
            {
                return StatusCode(500, "Internal Server Error. Please contact support.");
            }

            return BadRequest("Your request is invalid.");
        }



    }
}
