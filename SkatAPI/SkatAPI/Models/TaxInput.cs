using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SkatAPI.Models
{
    public class TaxInput
    {
        public TaxInput(string money, string token)
        {
            Money = money;
            Token = token;
        }

        public String Money { get; set; }
        public String Token { get; set; }

    }
}