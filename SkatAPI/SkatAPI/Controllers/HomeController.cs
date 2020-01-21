using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data.SqlClient;
using SkatAPI.Models;
using System.IdentityModel.Tokens.Jwt;


namespace SkatAPI.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "what ever";

            return View();
        }
    }
}
