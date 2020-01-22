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
            
            SqlCommand command = new SqlCommand("UPDATE dbo.Citizens set taxOwed = taxOwed + "+input.Money+" WHERE id = '" + email + "'", conn);
            command.ExecuteNonQuery();

            command.CommandText = "SELECT taxOwed from dbo.Citizens WHERE id = '"+email+"'";
            SqlDataReader reader = command.ExecuteReader();
            String taxOwedOutput = "";
            while (reader.Read())
            {
                var taxOwed = reader["taxOwed"];
                taxOwedOutput = taxOwed.ToString();
            }

            conn.Close();
            return Ok(new { statuscode = 200, message = input.Money + " is added to your taxrecord" , taxOwed = taxOwedOutput });
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
