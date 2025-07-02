using Microsoft.EntityFrameworkCore;
using Places_Services.Data;
using Places_Services.Repository;
using Places_Services.Repository.CategoryRepo;

namespace Category_Services
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<PlacesDBContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("PlacesAzureConnection")));

            builder.Services.AddScoped<IPlacesRepository, PlacesRepository>();
            builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();

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

            builder.Services.AddControllers();
            builder.Services.AddOpenApi();
            builder.Services.AddSwaggerGen();

            // ? Build after service registrations
            var app = builder.Build();

            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwagger();
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
