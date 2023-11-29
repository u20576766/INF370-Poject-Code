using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using UniBooks_Backend.Models;
using UniBooks_Backend.Interface_Repoistory;
using UniBooks_Backend.ViewModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Components.Forms;
using System.Diagnostics.CodeAnalysis;
using System.Reflection.Metadata.Ecma335;
using UniBooks_Backend.Model;
using UniBooks_Backend.Repository;
using UniBooks_Backend.Interface_Repository;
using System.Net;

namespace UniBooks_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShoppingCart_EquipmentController : ControllerBase
    {
        private readonly IShoppingCart_EquipmentRepository _ShoppingCart_EquipmentRepository;
        private readonly IEquipmentRepository _EquipmentRepository;
        private readonly IShoppingCartRepository _ShoppingCartRepository;
        private readonly IVATRepository _vATRepository;
        private readonly AppDbContext _appDbContext;

        public ShoppingCart_EquipmentController(IShoppingCart_EquipmentRepository ShoppingCart_EquipmentRepository, IEquipmentRepository equipmentRepository, IShoppingCartRepository shoppingCartRepository, AppDbContext appDbContext, IVATRepository vATRepository)
        {
            _ShoppingCart_EquipmentRepository = ShoppingCart_EquipmentRepository;
            _EquipmentRepository = equipmentRepository;
            _ShoppingCartRepository = shoppingCartRepository;
            _appDbContext = appDbContext;
            _vATRepository = vATRepository;
        }

        [HttpGet]
        [Route("GetShoppingCart_Equipments/{studentID}")]
        public async Task<IActionResult> GetShoppingCart_Equipments(int studentID)
        {
            try
            {
                var cart = await _ShoppingCartRepository.GetShoppingCartByStudentIdAsync(studentID);
                var results = await _ShoppingCart_EquipmentRepository.GetShoppingCart_EquipmentsAsync(cart.ShoppingCart_ID);
                // Create a list to hold the view models
                var viewModels = new List<ShoppingCart_EquipmentViewModel>();

                foreach (var item in results)
                {
                    var viewModel = new ShoppingCart_EquipmentViewModel
                    {
                        ShoppingCart_ID = item.ShoppingCart_ID,
                        Equipment_ID = item.Equipment_ID,
                        Price = item.Price,
                        Name = item.Name,
                        Image = item.Image,
                        Quantity = item.Quantity// You can set the quantity based on your requirements
                    };

                    viewModels.Add(viewModel);
                }

                return Ok(viewModels);
            }
            catch (Exception)
            {
                return StatusCode(StatusCodes.Status404NotFound);
            }
        }


        [HttpPost]
        [Route("AddShoppingCart_Equipment/{studentId}")]
        public async Task<IActionResult> AddShoppingCart_Equipment(ShoppingCart_EquipmentViewModel SCE, int studentId)
        {
            try
            {
                var cart = await _ShoppingCartRepository.GetShoppingCartByStudentIdAsync(studentId);
                var equipment = await _EquipmentRepository.GetEquipmentByIDAsync(SCE.Equipment_ID); // Replace with your equipment repository method
                var price = await _EquipmentRepository.GetOnePriceByEquipmentIDAsync(SCE.Equipment_ID); // Replace with your prices repository method
                var vat = await _vATRepository.GetVATAsync();

                if (equipment == null || price == null || vat == null)
                {
                    return BadRequest("Equipment, price, or VAT not found");
                }

                if (cart == null)
                {
                    return BadRequest("Cart not found");
                }

                // Calculate the price with VAT included
                decimal priceWithVAT = price.Amount + (price.Amount * (vat.Percent / 100));

                var newCartEquipment = new ShoppingCart_Equipment
                {
                    ShoppingCart_ID = cart.ShoppingCart_ID,
                    Equipment_ID = SCE.Equipment_ID,
                    Image = equipment.Image,
                    Price = priceWithVAT, // Use the calculated price with VAT included
                    Name = equipment.Name,
                    Quantity = 1
                };

                await _ShoppingCart_EquipmentRepository.AddOrUpdateEquipmentInCart(newCartEquipment);
                await _ShoppingCart_EquipmentRepository.SaveChangesAsync();

                return Ok(newCartEquipment);
            }
            catch (Exception)
            {
                return BadRequest("Invalid Request");
            }
        }



        //Increment Equipment in cart
        [HttpPut]
        [Route("IncreaseEquipment/{equipid}/{studentid}")]
        public async Task<IActionResult> IncreaseEquip(int equipid, int studentid)
        {
            try
            {
                // Get the equipment item from the shopping cart
                var equipmentItem = await _appDbContext.ShoppingCartEquipment
                    .FirstOrDefaultAsync(e => e.Equipment_ID == equipid && e.ShoppingCart.StudentID == studentid);

                if (equipmentItem != null)
                {

                    var equipInventory = await _EquipmentRepository.GetEquipmentByIDAsync(equipid);

                    if (equipInventory != null)
                    {
                        if (equipmentItem.Quantity < equipInventory.Quantity_On_Hand)
                        {
                            // Increment the quantity by 1
                            equipmentItem.Quantity += 1;

                            // Update the shopping cart's SubTotal (assuming CalculateSubTotal method is available)
                            //var cart = await _appDbContext.ShoppingCart
                            //    .Include(c => c.ShoppingCartEquipment)
                            //    .FirstOrDefaultAsync(c => c.StudentID == studentid);

                            //if (cart != null)
                            //{
                            //    cart.SubTotal = _ShoppingCartRepository.CalculateSubTotal(cart);
                            //}

                            await _appDbContext.SaveChangesAsync();

                            return Ok(new { message = "Equipment quantity increased successfully." });
                        }
                        else
                        {
                            return BadRequest("The limit of equipments in stock has been reached.");
                        }
                    }
                    else
                    {
                        return NotFound("Equipment not found in the inventory.");
                    }

                }
                else
                {
                    return NotFound("Equipment not found in the cart.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while increasing the equipment's quantity.");
            }
        }


        //Decrement Equipment in cart
        [HttpPut]
        [Route("DecreaseEquipment/{equipid}/{studentid}")]
        public async Task<IActionResult> DecreaseEquip(int equipid, int studentid)
        {
            try
            {
                // Get the equipment item from the shopping cart
                var equipmentItem = await _appDbContext.ShoppingCartEquipment
                    .FirstOrDefaultAsync(e => e.Equipment_ID == equipid && e.ShoppingCart.StudentID == studentid);

                if (equipmentItem != null)
                {
                    // Ensure the quantity is greater than 1 before decrementing
                    if (equipmentItem.Quantity > 1)
                    {
                        // Decrement the quantity by 1
                        equipmentItem.Quantity -= 1;

                        // Update the shopping cart's SubTotal (assuming CalculateSubTotal method is available)
                        //var cart = await _appDbContext.ShoppingCart
                        //    .Include(c => c.ShoppingCartEquipment)
                        //    .FirstOrDefaultAsync(c => c.StudentID == studentid);

                        //if (cart != null)
                        //{
                        //    cart.SubTotal = _ShoppingCartRepository.CalculateSubTotal(cart);
                        //}

                        await _appDbContext.SaveChangesAsync();

                        return Ok(new { message = "Equipment quantity decreased successfully." });

                    }
                    else
                    {
                        return BadRequest("Quantity cannot be decreased below 1.");
                    }
                }
                else
                {
                    return NotFound("Equipment not found in the cart.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while decreasing the equipment's quantity.");
            }
        }




    }
}