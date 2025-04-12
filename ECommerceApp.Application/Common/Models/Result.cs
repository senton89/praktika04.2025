﻿// ECommerceApp.Application/Common/Models/Result.cs
namespace ECommerceApp.Application.Common.Models
{
    public class Result
    {
        public bool Succeeded { get; set; }
        public string[] Errors { get; set; }

        internal Result(bool succeeded, IEnumerable<string> errors)
        {
            Succeeded = succeeded;
            Errors = errors.ToArray();
        }

        public static Result Success()
        {
            return new Result(true, Array.Empty<string>());
        }

        public static Result Failure(IEnumerable<string> errors)
        {
            return new Result(false, errors);
        }
    }

    public class Result<T> : Result
    {
        public T Data { get; set; }

        private Result(bool succeeded, T data, IEnumerable<string> errors)
            : base(succeeded, errors)
        {
            Data = data;
        }

        public static Result<T> Success(T data)
        {
            return new Result<T>(true, data, Array.Empty<string>());
        }

        public new static Result<T> Failure(IEnumerable<string> errors)
        {
            return new Result<T>(false, default, errors);
        }
    }
}