
using Booking_Services.Data;
using Booking_Services.Repository.PriceRepo;
using Booking_Services.Repository.SlotsRepo;
using Microsoft.EntityFrameworkCore;

namespace Booking_Services
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
           

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();

            builder.Services.AddDbContext<BookingDBContext>(options =>
            {
                options.UseSqlServer(builder.Configuration.GetConnectionString("PlacesAzureConnection"));
            });
            builder.Services.AddScoped<ISlotsRepository, SlotsRepository>();
            builder.Services.AddScoped<IPriceRepository, PriceRepository>();
            builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            // ? Add CORS BEFORE Build
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend",
                    policy =>
                    {
                        policy.WithOrigins("http://localhost:5173") // <-- your frontend port
                              .AllowAnyHeader()
                              .AllowAnyMethod();
                    });
            });

            builder.Services.AddOpenApi();
            builder.Services.AddSwaggerGen();


            var app = builder.Build();


            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.MapOpenApi();
            }
            app.UseSwaggerUI();

            app.UseHttpsRedirection();

            // ? Enable CORS Middleware
            app.UseCors("AllowFrontend");

            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
