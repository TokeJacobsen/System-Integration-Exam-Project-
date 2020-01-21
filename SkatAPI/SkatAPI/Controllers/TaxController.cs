using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.IdentityModel.Tokens.Jwt;
using System.Data.SqlClient;
using SkatAPI.Models;
using System.Web.Http.Results;

namespace SkatAPI.Controllers
{
    [RoutePrefix("Tax")]
    public class TaxController : ApiController
    {
        //
        [HttpPost]
        [Route("AddTax")]
        [AllowAnonymous]
        public IHttpActionResult AddTax([FromBody]TaxInput input)
        {
            String email;
            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jsonToken = handler.ReadToken(input.Token);
                var tokenS = handler.ReadToken(input.Token) as JwtSecurityToken;

                email = tokenS.Claims.First(claim => claim.Type == "email").Value;

            }catch (Exception e)
            {
                return BadRequest();
            }
            SqlConnection conn = new SqlConnection();
            conn.ConnectionString = @"Data Source = (localdb)\MSSQLLocalDB; Initial Catalog = SysIntTax; Integrated Security = True;";
            conn.Open();

            SqlCommand command = new SqlCommand("UPDATE dbo.Citizens set taxOwed = taxOwed + " + input.Money + " WHERE id = '" + email + "'", conn);
            command.ExecuteNonQuery();


            return Ok(new { message = input.Money +" is added to your taxrecord" });
        }

        [HttpGet]
        [Route("Test")]
        [AllowAnonymous]
        public String Test()
        {
            return "Virker!";
        }
       
    }
}
